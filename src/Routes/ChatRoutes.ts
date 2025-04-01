import express from "express";
import { getChatHistory, postOngoingAgent } from "../Controllers/ChatController";

const router = express.Router();

router.get("/history", getChatHistory);
router.post("/ongoingagent", postOngoingAgent);

export default router;
