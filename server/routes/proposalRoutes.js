import express from "express";
import {
  createProposal,
  getProjectProposals,
  getMyProposals,
  updateProposalStatus,
} from "../controllers/proposalController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, allowRoles("freelancer"), createProposal);
router.get("/my", protect, allowRoles("freelancer"), getMyProposals);
router.get(
  "/project/:projectId",
  protect,
  allowRoles("client"),
  getProjectProposals
);
router.patch("/:id", protect, allowRoles("client"), updateProposalStatus);

export default router;