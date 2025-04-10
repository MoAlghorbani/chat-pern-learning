import { Router } from "express";
import protectRoute from "../middleware/protectRoute.js";
import { sendMessage, getMessage, getConversations } from "../controllers/message.controller.js";

const router = Router();

router.get("/conversations", protectRoute as any, getConversations as any);
router.get("/:id", protectRoute as any, getMessage as any);
router.post("/send/:id", protectRoute as any, sendMessage);

export default router;
