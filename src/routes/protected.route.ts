import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { protectedControllerInstance } from "../instances/protected.instance";

const protectedRouter = Router();

protectedRouter.get("/", authMiddleware, protectedControllerInstance.handle);

export default protectedRouter;
