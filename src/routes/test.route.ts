import { Router } from "express";
import { authMiddleware } from "../middlewares/auth";
import { testControllerInstance } from "../instances/test.instance";

const testRouter = Router();

testRouter.post("/create", authMiddleware, testControllerInstance.createTest);
testRouter.put("/update", authMiddleware, testControllerInstance.updateTest);
testRouter.delete(
  "/delete/:testId",
  authMiddleware,
  testControllerInstance.deleteTest,
);
testRouter.get(
  "/find-tests",
  authMiddleware,
  testControllerInstance.findListsMany,
);
testRouter.post(
  "/run-tests",
  authMiddleware,
  testControllerInstance.runTestsInternal,
);
testRouter.post(
  "/run-tests-load",
  authMiddleware,
  testControllerInstance.runLoadTestsInternal,
);
testRouter.get(
  "/tests-logs",
  authMiddleware,
  testControllerInstance.testRunsByUserId,
);

export default testRouter;
