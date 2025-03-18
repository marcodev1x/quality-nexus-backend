import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { testControllerInstance } from "../instances/test.instance";

const testRouter = Router();

testRouter.post("/create", authMiddleware, testControllerInstance.createTest);
testRouter.put("/update", authMiddleware, testControllerInstance.updateTest);
testRouter.delete("/delete", authMiddleware, testControllerInstance.deleteTest);

export default testRouter;
