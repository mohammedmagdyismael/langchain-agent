import express from "express";
import { getChatHistory, postOngoingAgent } from "../Controllers/ChatController";
import userKeyValidation from "../middleware/UserAuthAndValidation";
const router = express.Router();

router.get("/history", userKeyValidation, getChatHistory);
router.post("/ongoingagent",userKeyValidation, postOngoingAgent);

export default router;
