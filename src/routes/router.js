import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { OtpRoutes } from "../modules/otp/otp.route.js";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { newsArticleRoutes } from "../modules/newsArticle/newsArticle.route.js";
import { CandidateRoutes } from "../modules/candidate/candidate.route.js";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    element: userRoutes,
  },
  {
    path: "/otp",
    element: OtpRoutes,
  },
  {
    path: "/auth",
    element: AuthRoutes,
  },
  {
    path: "/news-articles",
    element: newsArticleRoutes,
  },
  {
    path: "/candidates",
    element: CandidateRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.element);
});
