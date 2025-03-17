import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ProtectedController } from "../controllers/protected.controller";
import { Request, Response } from "express";

const protectedRouter = Router();
const protectedController = new ProtectedController();

protectedRouter.get("/", authMiddleware, protectedController.handle);

export default protectedRouter;
