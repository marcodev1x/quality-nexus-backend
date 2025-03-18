import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { testControllerInstance } from "../instances/test.instance";

const testRouter = Router();

testRouter.post("/create", authMiddleware, testControllerInstance.createTest);

export default testRouter;
