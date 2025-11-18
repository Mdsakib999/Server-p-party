import { Router } from "express";
import { CandidateController } from "./candidate.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";
import { handleUpload } from "../../config/multer.js";

const router = Router();

// Routes requiring admin access
router.post(
  "/create-candidate",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  handleUpload("array", "photos", 4),
  CandidateController.createCandidate
);

router.patch(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  CandidateController.updateCandidate
);

router.delete(
  "/:id",
  checkAuth(...["ADMIN", "SUPER_ADMIN"]),
  CandidateController.deleteCandidate
);

// Public routes
router.get("/", CandidateController.getAllCandidates);
router.get("/:id", CandidateController.getCandidateById);

export const CandidateRoutes = router;
