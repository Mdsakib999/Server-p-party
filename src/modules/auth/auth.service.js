import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../user/user.model.js";
import ApiError from "../../utils/ApiError.js";
import { envVariables } from "../../config/envVariables.js";
import { sendForgotPasswordEmail } from "../../utils/Email/sendEmail.js";
import { createNewAccessTokenWithRefreshToken } from "../../utils/userTokens.js";
import { redisClient } from "../../config/redisClient.js";

const getNewAccessToken = async (refreshToken) => {
  const newAccessToken = await createNewAccessTokenWithRefreshToken(
    refreshToken
  );
  return {
    accessToken: newAccessToken,
  };
};

const setPassword = async (userId, plainPassword) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (
    user.password &&
    user.auths.some(
      (providerObject) => providerObject.provider === "credential"
    )
  ) {
    throw new ApiError(
      400,
      "You have already set you password. Now you can change the password from your account's change password option"
    );
  }

  const credentialProvider = {
    provider: "credential",
    providerId: user.email,
  };

  const auths = [...user.auths, credentialProvider];

  user.password = plainPassword;

  user.auths = auths;

  await user.save();
};

const changePassword = async (oldPassword, newPassword, decodedToken) => {
  const user = await User.findById(decodedToken.userId);

  const isOldPasswordMatch = await bcrypt.compare(oldPassword, user.password);

  if (!isOldPasswordMatch) {
    throw new ApiError(403, "current Password does not match");
  }

  user.password = newPassword;

  await user.save();
};

const forgotPassword = async (email) => {
  const isUserExist = await User.findOne({ email });

  if (!isUserExist) {
    throw new ApiError(400, "User does not exist");
  }

  if (!isUserExist.isVerified) {
    throw new ApiError(400, "User is not verified");
  }

  if (isUserExist.isDeleted) {
    throw new ApiError(400, "You cant access your account! contact support");
  }

  const jwtPayload = {
    userId: isUserExist._id,
    email: isUserExist.email,
    role: isUserExist.role,
  };

  const resetToken = jwt.sign(jwtPayload, envVariables.JWT_ACCESS_SECRET, {
    expiresIn: "10m",
  });

  const redisKey = `reset-token:${resetToken}`;
  await redisClient.set(redisKey, isUserExist._id.toString(), {
    expiration: {
      type: "EX",
      value: 600,
    },
  });

  const resetLink = `${envVariables.CLIENT_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`;

  await sendForgotPasswordEmail(isUserExist.email, isUserExist.name, resetLink);
};

export const AuthServices = {
  getNewAccessToken,
  changePassword,
  setPassword,
  forgotPassword,
};
