import { Router } from "express";
import { userController } from "./user.controller.js";

const router = Router();

router.post("/register", userController.createUser);

export const userRoutes = router;
