import ApiError from "../../utils/ApiError.js";
import User from "./user.model.js";

const createUser = async (payload) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new ApiError(400, "User Already Exist");
  }

  const authProvider = { provider: "credential", providerId: email };

  const user = await User.create({
    email,
    auths: [authProvider],
    ...rest,
  });

  return user;
};

const getMe = async (userId) => {
  const user = await User.findById(userId).select("-password");
  return {
    data: user,
  };
};

export const UserServices = {
  createUser,
  getMe,
};
