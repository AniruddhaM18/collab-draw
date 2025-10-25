import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-common/config";

declare global {
    namespace Express{
        interface Request{
            userId?: string;
        }
    }
}

export async function authenticateUser(req: Request, res:Response, next: NextFunction){
    let token = req.cookies["jwt"];
    if(!token && req.headers.authorization) {
        const authHeader = req.headers.authorization;
        if(authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        }
    }
    if(!token) {
        res.status(401).json({
            message: "User not logged in"
        });
        return;
    }
    try {
        const verified = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if(!verified?.id) {
            res.status(401).json({
                message: "User not registered, invalid token"
            });
            return;
        }
        req.userId = verified.id;
        next();
    }catch(err){
        res.status(401).json({
            messaage: "Invalid token"
        })
    }
}