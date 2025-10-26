import express from "express";
import authRoute from "./routes/authRoutes.js";
import contentRoute from "./routes/contentRoutes.js";
import roomRoute from "./routes/roomRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { FRONTEND_URL } from "@repo/backend-common/config";
import { SERVER_URL } from "@repo/backend-common/config";


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(
    cors({
        origin : FRONTEND_URL,
        credentials: true
    })
);

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/room", roomRoute);
app.use("/api/v1/content", contentRoute);

app.listen(SERVER_URL, ()=> {
    console.log("Server is running @:3001");
})