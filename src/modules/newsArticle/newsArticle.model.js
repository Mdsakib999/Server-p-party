import { Schema, model } from "mongoose";

const ImageSchema = new Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false, versionKey: false }
);

const NewsArticleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    images: { type: [ImageSchema], default: [] },
    quote: { type: String, default: "" },
    tags: { type: [String], default: [] },
  },
  { timestamps: true, versionKey: false }
);

const NewsArticle = model("NewsArticle", NewsArticleSchema);

export default NewsArticle;
