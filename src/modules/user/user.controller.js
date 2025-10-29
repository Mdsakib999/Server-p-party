import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { UserServices } from "./user.service.js";

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

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
