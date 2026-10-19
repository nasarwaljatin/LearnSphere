import type { Response } from "express";
import type { AuthRequest } from "../types/extend-auth.js";
import { Course } from "../models/Course.js";
import { Types } from "mongoose";
import { razorpayInstance } from "../config/razorpay.js";
import crypto from "crypto";
import { CourseProgress } from "../models/CourseProgress.js";
import { User } from "../models/User.js";
import { mailSender } from "../utils/mailSender.js";
import { courseEnrollmentEmail } from "../mail/templates/courseEnrollmentEmail.js";
import { paymentSuccessEmail } from "../mail/templates/paymentSuccessEmail.js";

// Razorpay order notes are limited to 256 chars per value, so course ids are
// stored comma separated. 10 ObjectIds (24 chars each) comfortably fit.
const MAX_COURSES_PER_ORDER = 10;

type CheckoutValidation =
  | { ok: true; courseIds: string[]; totalAmount: number }
  | { ok: false; status: number; message: string };

// Validate the requested courses and compute the payable amount on the server,
// so the client can never decide the price or buy an unpublished course.
const validateCheckout = async (
  courses: unknown,
  userId: string
): Promise<CheckoutValidation> => {
  if (!Array.isArray(courses) || courses.length === 0) {
    return { ok: false, status: 400, message: "Please provide course Id!" };
  }

  const courseIds = [...new Set(courses.map(String))];
  if (courseIds.length > MAX_COURSES_PER_ORDER) {
    return {
      ok: false,
      status: 400,
      message: `You can purchase at most ${MAX_COURSES_PER_ORDER} courses at once.`,
    };
  }
  if (!courseIds.every((id) => Types.ObjectId.isValid(id))) {
    return { ok: false, status: 400, message: "Invalid course Id provided." };
  }

  const foundCourses = await Course.find({ _id: { $in: courseIds } });
  if (foundCourses.length !== courseIds.length) {
    return { ok: false, status: 404, message: "Could not find the course." };
  }

  let totalAmount = 0;
  for (const course of foundCourses) {
    if (course.status && course.status !== "Published") {
      return {
        ok: false,
        status: 400,
        message: `"${course.courseName}" is not available for purchase.`,
      };
    }
    if (course.studentsEnrolled.some((id) => id.toString() === userId)) {
      return {
        ok: false,
        status: 409,
        message: `You are already enrolled in "${course.courseName}".`,
      };
    }
    totalAmount += course.price ?? 0;
  }

  return { ok: true, courseIds, totalAmount };
};

// Initiate the razorpay order
export const capturePayment = async (req: AuthRequest, res: Response) => {
  const userId = req.auth?.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const checkout = await validateCheckout(req.body?.courses, userId);
    if (!checkout.ok) {
      return res
        .status(checkout.status)
        .json({ success: false, message: checkout.message });
    }

    // Free courses don't need a Razorpay order - enroll right away.
    if (checkout.totalAmount === 0) {
      await enrollStudents(checkout.courseIds, userId);
      return res.status(200).json({
        success: true,
        free: true,
        message: "Enrolled successfully.",
      });
    }

    // The course ids and buyer are pinned to the order, so verification can
    // trust the order instead of whatever course list the client sends back.
    const paymentRes = await razorpayInstance.orders.create({
      amount: Math.round(checkout.totalAmount * 100),
      currency: "INR",
      receipt: `${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      notes: {
        userId,
        courses: checkout.courseIds.join(","),
      },
    });

    return res.json({
      success: true,
      message: { ...paymentRes, key: process.env.RAZORPAY_KEY },
    });
  } catch (error) {
    console.log("Error while initiating order: ", error);
    return res.status(500).json({
      success: false,
      message: "Could not initiate order.",
    });
  }
};

const isValidSignature = (orderId: string, paymentId: string, signature: string) => {
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  const expected = Buffer.from(expectedSignature, "utf8");
  const received = Buffer.from(String(signature), "utf8");
  return (
    expected.length === received.length &&
    crypto.timingSafeEqual(expected, received)
  );
};

export const verifyPayment = async (req: AuthRequest, res: Response) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const userId = req.auth?.userId;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !userId) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed.",
    });
  }

  if (!isValidSignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed! Invalid signature.",
    });
  }

  try {
    const order = await razorpayInstance.orders.fetch(razorpay_order_id);
    const notes = (order.notes ?? {}) as Record<string, string | number>;

    if (String(notes.userId) !== userId) {
      return res.status(403).json({
        success: false,
        message: "This order does not belong to you.",
      });
    }

    const courseIds = String(notes.courses ?? "")
      .split(",")
      .filter(Boolean);
    if (courseIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No courses are attached to this order.",
      });
    }

    await enrollStudents(courseIds, userId);

    // Receipt mail is best-effort; a mail failure must not fail the enrollment.
    sendReceiptMail(userId, Number(order.amount), razorpay_order_id, razorpay_payment_id);

    return res.status(200).json({
      success: true,
      message: "Payment Verified!",
    });
  } catch (error) {
    console.log("Error while verifying payment: ", error);
    return res.status(500).json({
      success: false,
      message:
        error instanceof Error ? error.message : "Could not verify payment.",
    });
  }
};

// Enrolls a student into the given courses. Idempotent: replaying the same
// verification (double click, network retry) never enrolls twice.
export const enrollStudents = async (courseIds: string[], userId: string) => {
  for (const courseId of courseIds) {
    const alreadyEnrolled = await Course.exists({
      _id: courseId,
      studentsEnrolled: userId,
    });
    if (alreadyEnrolled) continue;

    const enrolledCourse = await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnrolled: userId } },
      { new: true }
    );
    if (!enrolledCourse) {
      throw new Error("Course not found!");
    }

    let courseProgress = await CourseProgress.findOne({
      courseID: courseId,
      userId,
    });
    if (!courseProgress) {
      courseProgress = await CourseProgress.create({
        courseID: courseId,
        userId,
        completedVideos: [],
      });
    }

    const enrolledStudent = await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: {
          courses: courseId,
          courseProgress: courseProgress._id,
        },
      },
      { new: true }
    );
    if (!enrolledStudent) {
      throw new Error("User not found!");
    }

    mailSender(
      enrolledStudent.email,
      `Successfully Enrolled into ${enrolledCourse.courseName}`,
      courseEnrollmentEmail(
        enrolledCourse.courseName,
        enrolledStudent.firstName,
        enrolledStudent.lastName
      )
    ).catch((error) =>
      console.log("Could not send enrollment email: ", error)
    );
  }
};

const sendReceiptMail = async (
  userId: string,
  amountInPaise: number,
  orderId: string,
  paymentId: string
) => {
  try {
    const student = await User.findById(userId);
    if (!student) return;
    await mailSender(
      student.email,
      `Payment Received`,
      paymentSuccessEmail(`${student.firstName}`, amountInPaise / 100, orderId, paymentId)
    );
  } catch (error) {
    console.log("Error occurred in sending payment success mail: ", error);
  }
};

// Kept for backwards compatibility with older clients. The receipt is now sent
// by verifyPayment once the payment is actually verified, so this endpoint
// only acknowledges the request.
export const sendPaymentSuccessEmail = async (
  req: AuthRequest,
  res: Response
) => {
  const { orderId, paymentId, amount } = req.body;
  if (!orderId || !paymentId || !amount || !req.auth?.userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields!",
    });
  }
  return res.status(200).json({
    success: true,
    message: "Receipt is sent after payment verification.",
  });
};
