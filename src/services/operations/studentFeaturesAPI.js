import { studentEndpoints } from "../apis";
import { toast } from "sonner";
import { apiConnector } from "../apiConnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png";
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API } = studentEndpoints;

const RAZORPAY_SCRIPT = "https://checkout.razorpay.com/v1/checkout.js";

function loadScript(src) {
  return new Promise((resolve) => {
    // Don't inject the checkout script again on every purchase
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

function onEnrolled(navigate, dispatch) {
  navigate("/dashboard/enrolled-courses");
  dispatch(resetCart());
}

export async function buyCourse(
  token,
  courses,
  userDetails,
  navigate,
  dispatch
) {
  const toastId = toast.loading("Loading ...");
  try {
    const res = await loadScript(RAZORPAY_SCRIPT);
    if (!res) {
      toast.error("Could not load Razorpay checkout. Please retry!");
      return;
    }

    // Initiate order using capture payment (amount is computed on the server)
    const orderResponse = await apiConnector(
      "POST",
      COURSE_PAYMENT_API,
      { courses },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!orderResponse.data.success) {
      throw new Error(orderResponse.data.message);
    }

    // Free courses are enrolled directly by the server
    if (orderResponse.data.free) {
      toast.success("You have been enrolled in the course.");
      onEnrolled(navigate, dispatch);
      return;
    }

    const order = orderResponse.data.message;
    const options = {
      key: order.key,
      currency: order.currency,
      amount: `${order.amount}`,
      order_id: order.id,
      name: "LearnSphere",
      description: "Thank You for Purchasing the Course",
      image: rzpLogo,
      prefill: {
        name: `${userDetails.firstName} ${userDetails.lastName ?? ""}`.trim(),
        email: `${userDetails.email}`,
      },
      theme: { color: "#14b8a6" },
      handler: function (response) {
        // Receipt email is sent by the server once the payment is verified
        verifyPayment(response, token, navigate, dispatch);
      },
      modal: {
        ondismiss: () => toast.info("Payment cancelled."),
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.on("payment.failed", function (response) {
      toast.error(
        response?.error?.description || "Oops, Payment Failed!"
      );
    });
    paymentObject.open();
  } catch (error) {
    toast.error(
      error?.response?.data?.message ||
        error?.message ||
        "Could Not Make Payment."
    );
  } finally {
    toast.dismiss(toastId);
  }
}

// Verify Payment:
async function verifyPayment(response, token, navigate, dispatch) {
  const toastId = toast.loading("Verifying Payment ...");
  dispatch(setPaymentLoading(true));
  try {
    const verifyResponse = await apiConnector(
      "POST",
      COURSE_VERIFY_API,
      {
        razorpay_order_id: response.razorpay_order_id,
        razorpay_payment_id: response.razorpay_payment_id,
        razorpay_signature: response.razorpay_signature,
      },
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!verifyResponse.data.success) {
      throw new Error(verifyResponse.data.message);
    }
    toast.success("Payment Successful, you have been enrolled in the course.");
    onEnrolled(navigate, dispatch);
  } catch (error) {
    toast.error(
      error?.response?.data?.message || "Could not verify payment."
    );
  } finally {
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
  }
}
