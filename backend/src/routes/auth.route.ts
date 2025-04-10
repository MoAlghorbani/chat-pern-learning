import express from "express";
import { getMe, login, logout, signup } from "../controllers/auth.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/me", protectRoute as any, getMe as any);

router.post("/signup", signup as any);
router.post("/login", login as any);
router.post("/logout", logout);

export default router;
