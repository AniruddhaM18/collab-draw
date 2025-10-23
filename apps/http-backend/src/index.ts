import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";
import { middleware } from "./middleware.js";
import { CreateUserSchema, SigninSchema, RoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";


const app = express();
app.use(express.json());

app.post("/signup", async (req , res) => {
   
    const parsedData = CreateUserSchema.safeParse(req.body);
    if(!parsedData.success) {
         res.json({
            message: "Incorrect Inputs"
        })
        return;
    }
    try {
    const user = await prismaClient.user.create({
        data : {
            emali: parsedData.data?.username,
            password: parsedData.data?.password,
            name: parsedData.data?.name
        }
    })
    res.json({ 
        userId: user.id
     })
    }catch(err) {
        res.status(411).json({
            message: "User with same username already exists"
        })
    }
});

app.post("/signin", async (req , res) => {

    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success) {
         res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    const user = await prismaClient.user.findFirst({
        where: {
            emali : parsedData.data.username,
            password : parsedData.data.password
        }
    });
    if(!user) {
        res.status(403).json({
            message: "Not Authorized"
        })
        return;
    }

    const token = jwt.sign({userId: user?.id}, JWT_SECRET);
    res.json({ token });
});

app.post("/room", middleware, async (req, res) => {

    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success) {
         res.json({
            message: "Incorrect Inputs"
        })
        return;
    }

    //@ts-ignore
    const userId = req.userId;

    try {
        const room = await prismaClient.room.create({
        data : {
            slug: parsedData.data.name,
            adminId: userId
        }
    })
    res.json({ roomId: room.id })
    }catch(err) {
        res.status(411).json({
            message: "Room already exists with this name"
        })
    }
    
});

app.get("/chats/:roomId", async (req , res) => {
    const roomId = Number(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
        where: {
            roomId : roomId
        },
        orderBy: {
            id: "desc"
        },
        take :50
    });
    res.json({
        messages
    })
});

app.get("/room/:slug", async (req , res) => {
    const slug = req.params.slug;
    const room = await prismaClient.room.findFirst({
        where: {
            slug
        }
    });
    res.json({
        room
    })
})

app.listen(3001, ()=> console.log("Server started @:3001"));

