import express from "express";
import { FrameEditorController } from "./frame-editor.controller.js";

const router = express.Router();

router.post("/upload", FrameEditorController.uploadFramedImage);

export default router;
