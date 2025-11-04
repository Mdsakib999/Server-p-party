import express from "express";
import { NewsArticleController } from "./newsArticle.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { handleUpload } from "../../config/multer.js";

const router = express.Router();

router.post(
  "/create-news-article",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  handleUpload("array", "images", 4),
  NewsArticleController.createArticle
);

router.get("/all-news-articles", NewsArticleController.getAllArticles);

router.get("/:slug", NewsArticleController.getArticleBySlug);

router.patch(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  handleUpload("array", "images", 4),
  NewsArticleController.updateArticle
);

router.delete(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  NewsArticleController.deleteArticle
);

export const newsArticleRoutes = router;
