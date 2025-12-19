import {Request,Response,NextFunction} from "express";
import { verifyToken,JwtPayload } from "../config/jwt";

export interface AuthRequest extends Request {
    user?: JwtPayload;
}
export const authenticate =(
    req:AuthRequest,
    _res:Response,
    next:NextFunction
) =>{
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer")){
        throw {statusCode:401, message:"Authentication token missing"};
    }

    const token = authHeader.split(" ")[1];

    try{
        const payload =verifyToken(token);
        req.user = payload;
        next();
    } catch{
        throw {statusCode:401,message:"Invalid or expired token"};
    }
}