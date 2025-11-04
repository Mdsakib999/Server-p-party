import { Router } from "express";
import { userController } from "./user.controller.js";
import { Roles } from "../../utils/roles.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { handleUpload } from "../../config/multer.js";

const router = Router();

router.post("/register", userController.createUser);

router.get("/me", checkAuth(...Roles), userController.getMe);

// router.put(
//   "/:id",
//   checkAuth(...Roles),
//   handleUpload("single", "image"),
//   userController.updateUser
// );

// router.delete("/:id", checkAuth(...Roles), userController.deleteUser);

export const userRoutes = router;
