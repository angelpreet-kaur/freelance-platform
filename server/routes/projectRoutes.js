import express from "express";
import {
  createProject,
  getProjects,
  getProjectById,
  getMyProjects,
} from "../controllers/projectController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getProjects);
router.get("/my", protect, allowRoles("client"), getMyProjects);
router.get("/:id", getProjectById);
router.post("/", protect, allowRoles("client"), createProject);

export default router;