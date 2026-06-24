import Razorpay from "razorpay";
import { CONFIGS } from "../config/index.js";

export const razorpayInstance = new Razorpay({
  key_id: CONFIGS.razorpay_key as string,
  key_secret: CONFIGS.razorpay_secret as string,
});
