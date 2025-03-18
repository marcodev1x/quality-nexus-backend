import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { ProtectedController } from "../controllers/protected.controller";
import { protectedControllerInstance } from "../instances/protected.instance";

const protectedRouter = Router();

protectedRouter.get("/", authMiddleware, protectedControllerInstance.handle);

export default protectedRouter;
