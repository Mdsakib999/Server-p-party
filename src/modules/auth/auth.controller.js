import passport from "passport";
import ApiError from "../../utils/ApiError.js";
import { catchAsync } from "../../utils/catchAsync.js";
import { createUserTokens } from "../../utils/userTokens.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { setAuthCookie } from "../../utils/setCookie.js";
import { AuthServices } from "./auth.service.js";
import { envVariables } from "../../config/envVariables.js";

const credentialsLogin = catchAsync(async (req, res, next) => {
  passport.authenticate("local", async (err, user, info) => {
    if (err) {
      return next(new ApiError(401, err));
    }

    if (!user) {
      return next(new ApiError(401, info.message));
    }

    const userTokens = createUserTokens(user);

    const { password: pass, ...rest } = user.toObject();

    setAuthCookie(res, userTokens);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "User Logged In Successfully",
      data: {
        accessToken: userTokens.accessToken,
        refreshToken: userTokens.refreshToken,
        user: rest,
      },
    });
  })(req, res, next);
});

const getNewAccessToken = catchAsync(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new ApiError(400, "No refresh token received from cookies");
  }

  const tokenInfo = await AuthServices.getNewAccessToken(refreshToken);

  setAuthCookie(res, tokenInfo);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "New Access Token Retrieved Successfully",
    data: tokenInfo,
  });
});

const logout = catchAsync(async (_req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User Logged Out Successfully",
    data: null,
  });
});

const changePassword = catchAsync(async (req, res) => {
  const newPassword = req.body.newPassword;
  const oldPassword = req.body.oldPassword;
  const decodedToken = req.user;

  await AuthServices.changePassword(oldPassword, newPassword, decodedToken);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password Changed Successfully",
    data: null,
  });
});

const resetPassword = catchAsync(async (req, res) => {
  await AuthServices.resetPassword(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password Changed Successfully",
    data: null,
  });
});

const setPassword = catchAsync(async (req, res) => {
  const decodedToken = req.user;
  const { password } = req.body;

  await AuthServices.setPassword(decodedToken.userId, password);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Password Changed Successfully",
    data: null,
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;

  await AuthServices.forgotPassword(email);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Email Sent Successfully",
    data: null,
  });
});

const googleCallbackController = catchAsync(async (req, res) => {
  let redirectTo = req.query.state ? req.query.state : "";

  if (redirectTo.startsWith("/")) {
    redirectTo = redirectTo.slice(1);
  }
  const user = req.user;

  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  const tokenInfo = createUserTokens(user);

  setAuthCookie(res, tokenInfo);

  res.redirect(`${envVariables.CLIENT_URL}/${redirectTo}`);
});

export const AuthControllers = {
  credentialsLogin,
  getNewAccessToken,
  logout,
  resetPassword,
  setPassword,
  forgotPassword,
  changePassword,
  googleCallbackController,
};
