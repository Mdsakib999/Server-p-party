import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";
import { OtpRoutes } from "../modules/otp/otp.route.js";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.element);
});
