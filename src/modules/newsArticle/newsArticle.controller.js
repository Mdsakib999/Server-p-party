import { NewsArticleServices } from "./newsArticle.service.js";
import { sendResponse } from "../../utils/sendResponse.js";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary.js";

const createArticle = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getAllArticles = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const getArticleBySlug = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

const updateArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payload = req.body;
    const updated = await NewsArticleServices.updateArticleById(id, payload);

    if (!updated) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Article not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Article updated successfully",
      data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const deleteArticle = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deleted = await NewsArticleServices.deleteArticleById(id);

    if (!deleted) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Article not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Article deleted successfully",
      data: deleted,
    });
  } catch (err) {
    next(err);
  }
};

export const NewsArticleController = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};
