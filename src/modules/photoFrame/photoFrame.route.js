import { Router } from "express";
import { PhotoFrameController } from "./photoFrame.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { handleUpload } from "../../config/multer.js";

const router = Router();

router.post(
  "/create-frame",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  handleUpload("single", "frame"),
  PhotoFrameController.createFrame,
);

router.get("/", PhotoFrameController.getAllFrames);

router.delete(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  PhotoFrameController.deleteFrame,
);

router.put(
  "/:id",
  checkAuth("ADMIN", "SUPER_ADMIN"),
  handleUpload("single", "frame"),
  PhotoFrameController.updateFrame,
);

export const photoFrameRoutes = router;
