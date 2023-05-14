import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { schemas, StatusCodes } from "../utils";

dotenv.config();

const validateToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Unauthorized",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY as string);

        if (!decoded) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                error: "Invalid token",
            });
        }

        const validToken = schemas.token.parse(decoded);

        // will give the req object user info for use in future from token (? could be useful -> would have to extend Request interface and change type of routes)
        // req.user = {
        //     id: validToken.id,
        //     email: validToken.email,
        //     name: validToken.name,
        //     role: validToken.role,
        // };

        next();
    } catch (error) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            error: "Invalid token",
        });
    }
};

export default validateToken;
