import bcrypt from "bcrypt";
import { model, Schema } from "mongoose";
import { envVariables } from "../../config/envVariables";

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

const professionalCareerSchema = new Schema(
  {
    type: { type: String, required: true },
    timeline: [
      {
        year: { type: Number },
        event: { type: String },
      },
    ],
  },
  { _id: false, versionKey: false }
);

const activitySchema = new Schema(
  {
    title: { type: String },
    date: { type: String },
    description: { type: String },
    image: { type: String },
    channel: { type: String },
  },
  { _id: false, versionKey: false }
);

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: Number, required: true },
    academicCareer: {
      schools: [{ type: String }],
      college: [{ type: String }],
      university: [{ type: String }],
      degree: [{ type: String }],
    },
    professionalCareer: [professionalCareerSchema],
    profession: { type: String },
    otherIncomeSources: [{ type: String }],
    electionArea: {
      division: { type: String },
      district: { type: String },
      constituency: { type: String },
    },
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
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String },
    presentAddress: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
    },
    permanentAddress: {
      country: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String },
    },
    facebookProfile: { type: String },
    memberType: {
      type: String,
      enum: ["NEW_PRIMARY", "RENEWAL"],
      default: "NEW_PRIMARY",
    },
    termsConditionAccepted: { type: Boolean, required: true },
    role: {
      type: String,
      enum: ["USER", "ADMIN", "SUPER_ADMIN"],
      default: "USER",
    },
    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    authProvider: authProviderSchema,
    personalInfo: {
      birthDate: { type: String },
      birthPlace: { type: String },
      nationality: { type: String },
      maritalStatus: { type: String },
      spouse: [{ type: String }],
      children: [{ type: String }],
    },
    activities: [activitySchema],
    recentActivities: [activitySchema],
    highlights: [{ type: String }],
    socialLinks: {
      website: { type: String },
    },
    photos: [{ type: String }],
    overallSummary: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

userSchema.index({ email: 1 }, { unique: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(envVariables.BCRYPT_SALT_ROUNDS);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

const User = model("User", userSchema);

export default User;
