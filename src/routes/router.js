import { Router } from "express";
import { userRoutes } from "../modules/user/user.route.js";

export const router = Router();

const moduleRoutes = [
  {
    path: "/user",
    element: userRoutes,
  },
  //   {
  //     path: "/auth",
  //     element: AuthRoutes,
  //   },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.element);
});
