import { envVariables } from "../config/envVariables";
import User from "../modules/user/user.model.js";
import ApiError from "../utils/ApiError.js";
import { verifyToken } from "../utils/jwt";

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

      const isUserExist = await User.findOne({ email: verifiedToken.email });

      if (!isUserExist) {
        throw new ApiError(400, "User does not exist");
      }
      if (!isUserExist.isVerified) {
        throw new ApiError(400, "User is not verified");
      }

      if (isUserExist.isDeleted) {
        throw new ApiError(400, "User is deleted");
      }

      if (!authRoles.includes(verifiedToken.role)) {
        throw new ApiError(403, "You are not permitted to view this route!!!");
      }
      req.user = verifiedToken;
      next();
    } catch (error) {
      console.log("jwt error", error);
      next(error);
    }
  };
