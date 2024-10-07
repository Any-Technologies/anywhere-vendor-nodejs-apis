import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export class AuthMiddleware {

    constructor() { }

    async verifyToken(req: Request, res: Response, next: NextFunction): Promise<any> {
        const token = req.body.token || req.query.token || req.headers["authorization"];

        if (!token) {
            return res.status(401).json({
                message: "Authentication failed",
                status: 401,
            });
        }

        try {
            const bearerToken = token.split(" ")[1];
            const decodedUserData = jwt.verify(bearerToken, String(process.env.ACCESS_TOKEN_SECRET));
            req.user = decodedUserData;

        } catch (error) {
            return res.status(401).json({
                message: "Authentication failed",
                status: 401,
            });
        }
        return next();
    }
}