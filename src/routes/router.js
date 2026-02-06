import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { OtpRoutes } from "../modules/otp/otp.route.js";
import { AuthRoutes } from "../modules/auth/auth.routes.js";
import { newsArticleRoutes } from "../modules/newsArticle/newsArticle.route.js";
import { CandidateRoutes } from "../modules/candidate/candidate.route.js";
import { activityRoutes } from "../modules/activity/activity.route.js";
import { photoFrameRoutes } from "../modules/photoFrame/photoFrame.route.js";
import { authLimiter, otpLimiter } from "../middlewares/rateLimiter.js";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    element: userRoutes,
  },
  {
    path: "/otp",
    element: OtpRoutes,
    middleware: otpLimiter,
  },
  {
    path: "/auth",
    element: AuthRoutes,
    middleware: authLimiter,
  },
  {
    path: "/news-articles",
    element: newsArticleRoutes,
  },
  {
    path: "/candidates",
    element: CandidateRoutes,
  },
  {
    path: "/activity",
    element: activityRoutes,
  },
  {
    path: "/photo-frames",
    element: photoFrameRoutes,
  },
];

moduleRoutes.forEach((route) => {
  if (route.middleware) {
    router.use(route.path, route.middleware, route.element);
  } else {
    router.use(route.path, route.element);
  }
});
