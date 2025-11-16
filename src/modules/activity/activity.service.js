import ApiError from "../../utils/ApiError.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary.js";
import Activity from "./activity.model.js";

const createActivity = async (payload, files = []) => {
  if (!payload.title) throw new ApiError(400, "Title is required");
  if (!payload.category) throw new ApiError(400, "Category is required");
  if (!payload.content) throw new ApiError(400, "Content is required");

  const slug = await generateUniqueSlug(payload.title);

  const doc = {
    title: payload.title,
    slug,
    category: payload.category,
    featuredImage: null,
    content: payload.content,
    videoLink: payload.videoLink || null,
  };

  if (files.length > 0) {
    const file = files[0];
    if (!file || !file.buffer) {
      throw new ApiError(400, "Invalid file upload");
    }

    const uploadResult = await uploadToCloudinary(file.buffer, "activities");
    if (!uploadResult || !uploadResult.url) {
      throw new ApiError(500, "Failed to upload image");
    }

    doc.featuredImage = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  const created = await Activity.create(doc);
  return created;
};

const getAllActivities = async () => {
  const activities = await Activity.find().sort({ createdAt: -1 }).lean();
  return activities;
};

const getActivityBySlug = async (slug) => {
  if (!slug) throw new ApiError(400, "Slug is required");
  const activity = await Activity.findOne({ slug }).lean();
  return activity;
};

const updateActivity = async (id, payload, files = []) => {
  if (!id) throw new ApiError(400, "Id is required");

  const activity = await Activity.findById(id);
  if (!activity) throw new ApiError(404, "Activity not found");

  if (payload.title && payload.title !== activity.title) {
    const newSlug = await generateUniqueSlug(payload.title);
    activity.slug = newSlug;
    activity.title = payload.title;
  }

  if (payload.category) activity.category = payload.category;
  if (payload.content) activity.content = payload.content;
  if (payload.videoLink !== undefined) activity.videoLink = payload.videoLink;

  if (files.length > 0) {
    const file = files[0];
    if (!file || !file.buffer) throw new ApiError(400, "Invalid file upload");

    const uploadResult = await uploadToCloudinary(file.buffer, "activities");
    if (!uploadResult || !uploadResult.url) {
      throw new ApiError(500, "Failed to upload image");
    }

    if (activity.featuredImage && activity.featuredImage.public_id) {
      try {
        await deleteFromCloudinary(activity.featuredImage.public_id);
      } catch (err) {
        console.error("Cloudinary delete failed", err);
      }
    }

    activity.featuredImage = {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    };
  }

  await activity.save();
  return activity.toObject();
};

const deleteActivity = async (id) => {
  if (!id) throw new ApiError(400, "Id is required");

  const activity = await Activity.findById(id);
  if (!activity) throw new ApiError(404, "Activity not found");

  if (activity.featuredImage && activity.featuredImage.public_id) {
    try {
      await deleteFromCloudinary(activity.featuredImage.public_id);
    } catch (err) {
      console.error("Cloudinary delete failed", err);
    }
  }

  await Activity.deleteOne({ _id: id });
  return true;
};

export const ActivityService = {
  createActivity,
  getAllActivities,
  getActivityBySlug,
  updateActivity,
  deleteActivity,
};
