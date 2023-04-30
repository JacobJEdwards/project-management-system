import { Request, Response, NextFunction } from "express";
import prisma from "../utils/db";
import generateToken from "../utils/generateToken";
import { LoginSchema } from "../schemas";

class AuthController {
    public async login(req: Request, res: Response, next: NextFunction) {
        try {
            const { email, password } = req.body;

            const validation = LoginSchema.safeParse({ email, password });

            if (!validation.success) {
                return res.status(400).json({ validation: validation.error });
            }

            const user = await prisma.user.findUnique({
                where: {
                    email: validation.data.email,
                },
            });

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
            if (user.password !== validation.data.password) {
                return res.status(401).json({ message: "Incorrect password" });
            }
            const token = generateToken(user);

            res.status(200).json({ message: "Login successful", token, user });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
