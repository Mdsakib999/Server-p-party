import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { createUserTokens } from "../../utils/userTokens.js";
import { OTPService } from "./otp.service.js";

const sendOTP = catchAsync(async (req, res) => {
  const { email, name } = req.body;

  await OTPService.sendOTP(email, name);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP sent successfully",
    data: null,
  });
});

const verifyOTP = catchAsync(async (req, res) => {
  const { email, otp } = req.body;

  const user = await OTPService.verifyOTP(email, otp);

  const userTokens = createUserTokens(user);

  const { password: _, ...remainingData } = user.toObject();

  setAuthCookie(res, userTokens);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "OTP Verified! user logged In successfully",
    data: remainingData,
  });
});

export const OTPController = {
  sendOTP,
  verifyOTP,
};
