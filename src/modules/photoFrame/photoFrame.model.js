import { Schema, model } from "mongoose";

const photoFrameSchema = new Schema(
  {
    division: {
      type: String,
      required: true,
      enum: [
        "Dhaka",
        "Chattogram",
        "Barishal",
        "Khulna",
        "Mymensingh",
        "Rajshahi",
        "Rangpur",
        "Sylhet",
      ],
    },
    district: {
      type: String,
      required: true,
    },
    constituency: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export const PhotoFrame = model("PhotoFrame", photoFrameSchema);
