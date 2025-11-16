import { model, Schema } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const activitySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
    featuredImage: {
      type: [ImageSchema],
      default: [],
    },
    content: {
      type: String,
      required: true,
    },
    videoLink: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

const Activity = model("Activity", activitySchema);

export default Activity;
