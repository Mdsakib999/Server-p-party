import slugify from "slugify";
import NewsArticle from "../modules/newsArticle/newsArticle.model.js";

export const generateUniqueSlug = async (title) => {
  const base = slugify(title || "article", { lower: true, strict: true });
  let slug = base;
  let counter = 0;

  while (await NewsArticle.exists({ slug })) {
    counter += 1;
    slug = `${base}-${counter}`;
  }

  return slug;
};
