import { Request, Response } from "express";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { CreateUserSchema, SigninSchema } from "@repo/common/types";
import { JWT_SECRET, SALTROUNDS } from "@repo/backend-common/config";


export async function signup(req: Request, res: Response) {
    const ValidUser = CreateUserSchema.safeParse(req.body);

    if(ValidUser.error) {
        res.status(404).json({
            message: "Invalid Inputs"
        });
        return;
    }
    try {
        const salt = parseInt(SALTROUNDS);
        const hashedPwrd = await bcrypt.hash(
            ValidUser.data.password,
            salt
        );
        const userCreated = await prismaClient.user.create({
            data: {
                 username : ValidUser.data.username,
                 password : hashedPwrd,
                 name : ValidUser.data.name
            }
        });
        const user = {
            id : userCreated.id,
            username : userCreated.username,
            password : userCreated.password,
            photo : userCreated.photo
        }

        const token = jwt.sign(user, JWT_SECRET);
        res.cookie("jwt", token ,{
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });
        res.json({
            message: "User Signed Up",
            user,
            token
        });
        return;
    } catch(err) {
        console.log(err);
        res.status(401).json({
            message: "Couldn't create user please try again later"
        });
    }
}

export async function signin(req: Request, res:Response) {
    const checkUser = SigninSchema.safeParse(req.body);
    
    if(checkUser.error) {
        res.status(404).json({
            message: "Invalid Inputs"
        });
        return;
    }
    try {
        const userFound = await prismaClient.user.findFirst({
            where : {
                username : checkUser.data.username
            }
        });
        if(!userFound) {
            res.status(405).json({
                message: "Username doesn't exist"
            });
            return;
        }
        const checkPassword = await bcrypt.compare(
            checkUser.data.password,
            userFound.password
        );
        if(!checkPassword){
            res.status(404).json({
                message: "Inccorect Password"
            });
            return;
        }
        const user = {
            id : userFound.id,
            username : userFound.username,
            name : userFound.name,
            photo : userFound.photo
        }
        const token = jwt.sign(user, JWT_SECRET);
        res.cookie("jwt", token ,{
            httpOnly: true,
            secure: true,
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.json({
            message: "User signed in",
            user,
            token
        });
        return;

        }catch(err) {
        console.log(err);
        res.status(404).json({
            message: "Error while signing in"
        });
    }
}

async function signout(req: Request, res: Response){
    res.clearCookie("jwt");
    res.json({
        message: "User logged out"
    });
}

export async function infoController(req: Request, res: Response) {
    const userId = req.userId;
    try {
        const userFound = await prismaClient.user.findUnique({
            where: {
                id: userId
            }
        });

        const user = {
            id: userFound?.id,
            name: userFound?.name,
            username: userFound?.username
        }
        res.status(200).json({
            message: "User info",
            user
        })
    }catch(err){
        console.log(err);
        res.status(401).json({
            message: "Error faced while getting user info, try again",
         });
    }
}


