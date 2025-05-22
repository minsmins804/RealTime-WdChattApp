import express from "express"
import { protectRoute } from "../middleware/auth.middleware.js"
import { getMessages, getUserForSidebar, sendMessage} from "../controllers/message.controllers.js"   

const router = express.Router();

router.get("/user", protectRoute, getUserForSidebar)
router.get("/:id", protectRoute, getMessages)

router.post("/send/:id", protectRoute, sendMessage);

export default router;

