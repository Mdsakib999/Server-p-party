import express from "express";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { handleUpload } from "../../config/multer.js";
import { ActivityController } from "./activity.controller.js";

const router = express.Router();

router.get("/all-activities", ActivityController.getAllActivities);

router.get("/:slug", ActivityController.getActivityBySlug);

router.post(
  "/add-activity",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  handleUpload("single", "image"),
  ActivityController.createActivity
);

router.patch(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  handleUpload("single", "image"),
  ActivityController.updateActivity
);

router.delete(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  ActivityController.deleteActivity
);

export const activityRoutes = router;
