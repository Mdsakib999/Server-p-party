import { Router } from "express";
import { CandidateController } from "./candidate.controller.js";
import { checkAuth } from "../../middlewares/checkAuth.js";

const router = Router();

// Routes requiring admin access
router.post(
  "/create-candidate",
  checkAuth,
  CandidateController.createCandidate
);

router.patch("/:id", checkAuth, CandidateController.updateCandidate);

router.delete("/:id", checkAuth, CandidateController.deleteCandidate);

// Public routes
router.get("/", CandidateController.getAllCandidates);
router.get("/:id", CandidateController.getCandidateById);

export const CandidateRoutes = router;
