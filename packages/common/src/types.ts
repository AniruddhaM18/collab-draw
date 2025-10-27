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
  // Messages shared via WebSocket (for frontend and ws - server)
  type: z.enum([
    "connect_room",
    "disconnect_room",
    "chat_message",
    "draw",
    "error_message",
  ]),
  roomId: z.string(),
  userId: z.string(),
  content: z.string().optional(),
});

export type WebSocketMessage = z.infer<typeof WebSocketMessageSchema>;

