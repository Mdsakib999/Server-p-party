import { envVariables } from "../config/envVariables.js";
import User from "../modules/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt.js";

export const checkAuth =
  (...authRoles) =>
  async (req, _res, next) => {
    try {
      const accessToken = req.headers.authorization;

      if (!accessToken) {
        throw new ApiError(403, "No Token Received");
      }

      const verifiedToken = verifyToken(
        accessToken,
        envVariables.JWT_ACCESS_SECRET
      );

      const user = await User.findOne({ email: verifiedToken.email });
      if (!user) throw new ApiError(400, "User does not exist");
      if (!user.isVerified) throw new ApiError(400, "User is not verified");
      if (user.isDeleted) throw new ApiError(400, "User is deleted");

      if (authRoles.length && !authRoles.includes(user.role)) {
        throw new ApiError(403, "unauthorize access!");
      }

      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
