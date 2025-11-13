import ApiError from "../../utils/ApiError.js";
import NewsArticle from "./newsArticle.model.js";
import { generateUniqueSlug } from "../../utils/generateUniqueSlug.js";
import { deleteFromCloudinary } from "../../utils/uploadToCloudinary.js";

const createArticle = async (payload) => {
  if (!payload?.title) throw new ApiError(400, "Title is required");

  const slug = await generateUniqueSlug(payload.title);

  const article = new NewsArticle({
    ...payload,
    slug,
  });

  await article.save();
  return article.toObject({ versionKey: false });
};

const getAllArticles = async ({ page = 1, limit = 20, tag, search } = {}) => {
  const query = {};

  if (tag) {
    query.tags = tag;
  }

  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  page = Math.max(1, parseInt(page, 10));
  limit = Math.max(1, Math.min(100, parseInt(limit, 10)));

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    NewsArticle.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean(),
    NewsArticle.countDocuments(query),
  ]);

  return {
    items,
    meta: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

const getArticleBySlug = async (slug) => {
  if (!slug) throw new ApiError(400, "Slug is required");
  const article = await NewsArticle.findOne({ slug }).lean();
  return article;
};

const updateArticle = async (id, payload) => {
  const article = await NewsArticle.findById(id);
  if (!article) {
    throw new ApiError(404, "article Not Found");
  }

  if (payload?.title) {
    payload.slug = await generateUniqueSlug(payload.title);
  }

  const updated = await NewsArticle.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  return updated;
};

const deleteArticle = async (id) => {
  const article = await NewsArticle.findById(id);

  if (!article) throw new ApiError(404, "Article Not found");

  if (article?.images?.length > 0) {
    const ids = article.images.map((img) => img?.public_id);
    await deleteFromCloudinary(ids);
  }

  await NewsArticle.deleteOne({ _id: id });
  return true;
};

export const NewsArticleServices = {
  createArticle,
  getAllArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
};
