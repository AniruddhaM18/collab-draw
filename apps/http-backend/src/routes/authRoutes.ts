import { Router } from "express";
import { signup, signin, signout, infoController } from "../controller/auth.controller.js";
import { authenticateUser } from "../middleware.js";

const router : Router = Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("signout", signout);
router.post("info", authenticateUser, infoController);

export default router;