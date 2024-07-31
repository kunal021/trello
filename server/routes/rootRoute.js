import express from "express";
import authRoute from "./authRoute.js";
import taskRoute from "./taskRoute.js";

const router = express.Router();

router.use("/auth", authRoute);
router.use("/task", taskRoute);

export default router;
