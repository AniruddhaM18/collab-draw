import { Router } from "express";
import { createRoom, joinRoom, fetchAllRooms } from "../controller/room.controller.js";
import { authenticateUser } from "../middleware.js";

const router: Router = Router();

router.post("/create", authenticateUser , createRoom);
router.post("/join", authenticateUser, joinRoom);
router.post("/all", authenticateUser, fetchAllRooms);

export default router;
