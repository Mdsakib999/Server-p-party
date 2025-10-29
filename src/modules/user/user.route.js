import { Router } from "express";
import { userController } from "./user.controller.js";
import { Roles } from "../../utils/roles.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();

router.post("/register", userController.createUser);
router.get("/me", checkAuth(...Roles), userController.getMe);

export const userRoutes = router;
