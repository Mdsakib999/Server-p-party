import { NewsArticleServices } from "./newsArticle.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import {
  deleteFromCloudinary,
  uploadToCloudinary,
} from "../../utils/uploadToCloudinary.js";
import NewsArticle from "./newsArticle.model.js";
import ApiError from "../../utils/ApiError.js";
import { catchAsync } from "../../utils/catchAsync.js";

const createArticle = catchAsync(async (req, res) => {
  const files = req.files || [];

  if (files.length > 4) {
    return res.status(400).json({ message: "Maximum 4 images allowed" });
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, "news-articles"))
  );

  const payload = {
    ...req.body,
    title: req.body.title?.trim(),
    description: req.body.description?.trim() || "",
    quote: req.body.quote?.trim() || "",
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    images: uploadedImages,
  };

  const article = await NewsArticleServices.createArticle(payload);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Article created successfully",
    data: article,
  });
});

const getAllArticles = catchAsync(async (req, res) => {
  const { page, limit, tag, search } = req.query;

  const result = await NewsArticleServices.getAllArticles({
    page,
    limit,
    tag,
    search,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Articles fetched successfully",
    meta: result.meta,
    data: result.items,
  });
});

const getArticleBySlug = catchAsync(async (req, res) => {
  const { slug } = req.params;
  const article = await NewsArticleServices.getArticleBySlug(slug);

  if (!article) {
    return sendResponse(res, {
      statusCode: 404,
      success: false,
      message: "Article not found",
    });
  }

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article fetched successfully",
    data: article,
  });
});

const updateArticle = catchAsync(async (req, res) => {
  const { id } = req.params;
  const files = req.files || [];

  const existingImages = req.body.existingImages
    ? JSON.parse(req.body.existingImages)
    : [];

  const currentArticle = await NewsArticle.findById(id);
  if (!currentArticle) {
    return res.status(404).json({
      success: false,
      message: "Article Not Found",
    });
  }

  const removedImages = currentArticle.images.filter(
    (currentImg) =>
      !existingImages.some(
        (existingImg) => existingImg.public_id === currentImg.public_id
      )
  );

  if (removedImages.length > 0) {
    const publicIdsToDelete = removedImages.map((img) => img.public_id);
    await deleteFromCloudinary(publicIdsToDelete);
  }

  const uploadedImages = await Promise.all(
    files.map((file) => uploadToCloudinary(file.buffer, "news-articles"))
  );

  const allImages = [...existingImages, ...uploadedImages];

  if (allImages.length > 4) {
    throw new ApiError(400, "Maximum 4 images allowed");
  }

  const payload = {
    ...req.body,
    title: req.body.title?.trim(),
    description: req.body.description?.trim() || "",
    quote: req.body.quote?.trim() || "",
    tags: req.body.tags ? JSON.parse(req.body.tags) : [],
    images: allImages,
  };

  const updated = await NewsArticleServices.updateArticle(id, payload);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article updated successfully",
    data: updated,
  });
});

const deleteArticle = catchAsync(async (req, res) => {
  const { id } = req.params;
  await NewsArticleServices.deleteArticle(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Article deleted successfully",
    data: null,
  });
});

export const NewsArticleController = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};
