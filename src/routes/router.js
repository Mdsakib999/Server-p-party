import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { OtpRoutes } from "../modules/otp/otp.route.js";
import { AuthRoutes } from "../modules/auth/auth.routes.js";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.element);
});
