import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import { random } from "../utils.js";
import { JoinRoomSchema } from "@repo/common/types";


export async function createRoom(req: Request, res: Response) {
    try {
        const userId = req.userId;
        const joinCode = random(6);

        if(!userId) {
            res.status(401).json({
                message: "User Id not found"
            });
            return;
        }
        const room = await prismaClient.room.create({
            data: {
                title: req.body.title,
                joinCode,
                adminId: userId,
                participants: {
                    connect: [{ id: userId }],
                }
            }
        });
        res.status(201).json({
            message: "Room created successfully",
            room
        });
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Error creating room"
        });
    }
}

export async function joinRoom(req: Request, res: Response){
    const userId = req.userId;
    if(!userId){
        res.status(401).json({
            message: "User Id not found"
        });
        return;
    }
    const inputs = JoinRoomSchema.safeParse(req.body);
    if(!inputs.success) {
        res.status(411).json({
            message: "Invalid inputs"
      });
      return;
    }
    try {
        const joinCode = inputs.data.joinCode;
        const room = await prismaClient.room.update({
            where: {
                joinCode: joinCode
            }, 
            data : {
                participants: {
                    connect: {
                        id : userId
                    }
                }
            }
        });
        res.json({
            message: "Room joined Successfully",
            room
        });
        
    }catch(err) {
        console.log(err);
        res.status(400).json({
            message: "Faced error while joining room"
        });
    }
}

export async function fetchAllRooms(req: Request, res: Response){
    const userId = req.userId;
    if(!userId){
        res.status(401).json({
            message: "User not found"
        });
        return;
    }
    try{
        const rooms = await prismaClient.room.findMany({
            where: {
                participants: {
                    some: { id: userId }
                }
            }, 
            select: {
                id: true,
                title: true,
                joinCode: true,
                createdAt: true,
                admin: {
                    select: {
                        username: true
                    }
                },
                adminId: true,
                chat: {
                    take: 1,
                    orderBy: {
                        serialNumber: "desc"
                    },
                    select: {
                        user: {
                            select: {
                                username: true
                            }
                        },
                        content: true,
                        createdAt: true,
                    }
                },
                draw: {
                    take: 10,
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        const sortedRooms = rooms.sort((a, b) => {
            const aLatestChat = a.chat[0]?.createdAt || a.createdAt;
            const bLatestChat = b.chat[0]?.createdAt || b.createdAt;
            return new Date(bLatestChat).getTime() - new Date(aLatestChat).getTime();
        });
        res.json({
            message: "Rooms fetched Successfully",
            rooms : sortedRooms
        })

    }catch(err) {
        console.log(err);
        res.json({
            message: "Error fetching Room"
        });
    }
}
