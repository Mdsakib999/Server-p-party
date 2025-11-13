import { catchAsync } from "../../utils/catchAsync.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";
import { OTPService } from "../otp/otp.service.js";
import { UserServices } from "./user.service.js";

const createUser = catchAsync(async (req, res) => {
  const user = await UserServices.createUser(req.body);

  await OTPService.sendOTP(user?.email, user?.name);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User Created Successfully",
    data: user,
  });
});

const updateUser = catchAsync(async (req, res) => {
  const file = req.file;
  let uploadedImage;

  if (file) {
    uploadedImage = await uploadToCloudinary(file.buffer, "user-profile");
  }

  const payload = {
    ...req.body,
  };

  if (uploadedImage?.url) {
    payload.photos = [
      {
        url: uploadedImage?.url,
        public_id: uploadedImage?.public_id,
      },
    ];
  }

  const user = await UserServices.updateUser(req.params.id, payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated Successfully",
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
  updateUser,
  getMe,
};
