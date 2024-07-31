import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  updateTaskStatus,
  deleteTask,
} from "../controllers/taskController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

router.post("/create", authMiddleware, createTask);
router.patch("/update/:id", authMiddleware, updateTask);
router.patch("/update-status/:id", authMiddleware, updateTaskStatus);
router.delete("/delete/:id", authMiddleware, deleteTask);
router.get("/get", authMiddleware, getTasks);

export default router;
