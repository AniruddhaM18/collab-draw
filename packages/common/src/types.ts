import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string(),
    name: z.string()
});

export const SigninSchema = z.object({
    username: z.string().min(3).max(30),
    password: z.string()
});

export const RoomSchema = z.object({
    name : z.string().min(3).max(20)
});

export const JoinRoomSchema = z.object({
    joinCode : z.string().length(6)
})

export const WebSocketMessageSchema = z.object({
    type : z.enum([
        "connect_room",
        "disconnect_room",
        "chat_message",
        "draw",
        "error_message"
    ]),
    roomId: z.string(),
    userId: z.string(),
    content: z.string()
})


export type WebsocketMessage = z.infer<typeof WebSocketMessageSchema>;

