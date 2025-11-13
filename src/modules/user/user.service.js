import ApiError from "../../utils/ApiError.js";
import User from "./user.model.js";
import { deleteFromCloudinary } from "../../utils/uploadToCloudinary.js";

const createUser = async (payload) => {
  const { email, password, ...rest } = payload;

  const isUserExist = await User.findOne({ email });

  if (isUserExist) {
    throw new ApiError(400, "User Already Exist");
  }

  const authProvider = { provider: "credential", providerId: email };

  const user = await User.create({
    email,
    password,
    auths: [authProvider],
    ...rest,
  });

  // eslint-disable-next-line no-unused-vars
  const { password: _, ...remainingData } = user.toObject();

  return remainingData;
};

const updateUser = async (userId, payload) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User Not Found");
  }

  if (user.photos?.length) {
    const cloudinaryPhotos = user.photos
      .filter((p) => p?.public_id)
      .map((p) => p?.public_id);
    if (cloudinaryPhotos.length > 0) {
      await deleteFromCloudinary(cloudinaryPhotos);
    }
  }

  for (const key in payload) {
    user[key] = payload[key];
  }

  /*
   * It updates (or overwrites) only the fields in the user
   * document that are present in the payload —
   * other fields remain unchanged
   */
  Object.assign(user, payload);
  await user.save();

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
  updateUser,
  getMe,
};
