import slugify from "slugify";
import ApiError from "../../utils/ApiError.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary.js";
import Activity from "./activity.model.js";

const createActivity = async (payload, file) => {
  if (!payload.title) throw new ApiError(400, "Title is required");
  if (!payload.category) throw new ApiError(400, "Category is required");
  if (!payload.content) throw new ApiError(400, "Content is required");
  if (!file || !file.buffer) throw new ApiError(400, "Featured image is required");

  const processed = payload.title.trim().normalize("NFC");

  let slug = slugify(processed, {
    lower: false,
    strict: false,
    locale: "bn",
  });

  if (!slug) {
    slug = processed.replace(/\s+/g, "-");
  }

  const uploadResult = await uploadToCloudinary(file.buffer, "activities");
  if (!uploadResult || !uploadResult.url) {
    throw new ApiError(500, "Failed to upload image");
  }

  const doc = {
    title: payload.title,
    slug,
    category: payload.category,
    featuredImage: {
      url: uploadResult.url,
      public_id: uploadResult.public_id,
    },
    content: payload.content,
    videoLink: payload.videoLink || null,
  };

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

const updateActivity = async (id, payload, file) => {
  if (!id) throw new ApiError(400, "Id is required");

  const activity = await Activity.findById(id);
  if (!activity) throw new ApiError(404, "Activity not found");

  if (payload.title && payload.title !== activity.title) {
    const newSlug = slugify(payload.title, {
      lower: false,
      strict: false,
      locale: "bn",
    });

    activity.slug = newSlug;
    activity.title = payload.title;
  }

  if (payload.category) activity.category = payload.category;
  if (payload.content) activity.content = payload.content;
  if (payload.videoLink !== undefined) activity.videoLink = payload.videoLink;

  if (file) {
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
