import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { envVariables } from "../../config/envVariables.js";

const authProviderSchema = new Schema(
  {
    provider: {
      type: String,
      enum: ["credential", "google"],
      required: true,
    },
    providerId: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider?.provider === "credential";
      },
    },
    phoneNumber: { type: String },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    auths: [authProviderSchema],
    photos: [{ type: String }],
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(Number(envVariables.BCRYPT_SALT_ROUNDS));
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

export default User;
