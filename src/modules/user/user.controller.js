import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { OTPService } from "../otp/otp.service.js";
import { UserServices } from "./user.service.js";

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  // automatic otp send
  await OTPService.sendOTP(user?.email, user?.name);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User Created Successfully",
    data: user,
  });
});

const getMe = catchAsync(async (req, res) => {
  const decodedToken = req.user;
  const result = await UserServices.getMe(decodedToken.userId);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User retrieved Successfully",
    data: result.data,
  });
});

export const userController = {
  createUser,
  getMe,
};
