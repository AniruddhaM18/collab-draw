import { Router } from "express";
import { fetchAllMessages, fetchAllDraws, fetchHomeInfo } from "../controller/content.controller.js";
import { authenticateUser } from "../middleware.js";

const router : Router = Router();

router.get("/home", authenticateUser, fetchHomeInfo);
router.get("/chat/:roomId", authenticateUser, fetchAllMessages);
router.get("/draws/:roomId", authenticateUser, fetchAllDraws);

export default router;