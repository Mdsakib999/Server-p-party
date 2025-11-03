import { redisClient } from "../../config/redisClient.js";
import ApiError from "../../utils/ApiError.js";
import { sendOTPEmail } from "../../utils/Email/sendEmail.js";
import { generateOTP } from "../../utils/generateOtp.js";
import User from "../user/user.model.js";

const sendOTP = async (email, name) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "You are already verified");
  }

  const otp = generateOTP();

  const redisKey = `otp:${email}`;

  await redisClient.set(redisKey, otp, {
    expiration: {
      type: "EX",
      value: 120,
    },
  });
  console.log("FROM SENDOTP", redisKey);

  await sendOTPEmail(email, name, otp);
};

const verifyOTP = async (email, otp) => {
  const user = await User.findOne({ email });
  console.log(user);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  if (user.isVerified) {
    throw new ApiError(400, "You are already verified");
  }

  const redisKey = `otp:${email}`;
  console.log("FROM VERIFY OTP", redisKey);

  const savedOTP = await redisClient.get(redisKey);
  console.log("SAVED OTP FROM veirfy OTP", savedOTP);
  if (!savedOTP) {
    throw new ApiError(401, "Invalid OTP");
  }

  if (savedOTP !== otp) {
    throw new ApiError(401, "Invalid OTP");
  }

  await Promise.all([
    User.updateOne({ email }, { isVerified: true }, { runValidators: true }),
    redisClient.del([redisKey]),
  ]);

  return user;
};

export const OTPService = {
  sendOTP,
  verifyOTP,
};
