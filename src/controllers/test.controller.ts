import { Response } from "express";
import {
  TestLoadSchema,
  TestSchema,
  TestSchemaUpdate,
} from "../models/Test.model";
import { RequestAuth } from "../types/RequestAuth";
import { testInstance } from "../instances/test.instance.ts";
import { runTests } from "../services/runTest.service.ts";
import { loadTestInstance } from "../instances/load.instance.ts";
import { testRunsInstance } from "../instances/testRuns.instance.ts";

export class TestController {
  async createTest(req: RequestAuth, res: Response) {
    const verifyValidate = TestSchema.safeParse(req.body);

    if (!req.userEmail) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    if (!verifyValidate.success) {
      res.status(400).json({
        message: verifyValidate.error.flatten().fieldErrors,
      });
      return;
    }

    const { description, type, config } = verifyValidate.data;

    const registerTest = await testInstance.createTest(
      {
        description,
        type,
        config,
      },
      req.userEmail,
    );

    res.status(201).json({ message: "Teste criado com sucesso", registerTest });
  }

  async updateTest(req: RequestAuth, res: Response) {
    const validateSchemaUpdate = TestSchemaUpdate.safeParse(req.body);

    if (!req.userEmail) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    if (!validateSchemaUpdate.success) {
      res.status(400).json({
        message: validateSchemaUpdate.error.flatten().fieldErrors,
      });
      return;
    }

    const updateTestContent = await testInstance.updateTest(
      validateSchemaUpdate.data.testId,
      validateSchemaUpdate.data,
    );

    if (!updateTestContent) {
      res.status(404).json({
        message: "Test not found",
      });
      return;
    }

    res.status(200).json(updateTestContent);
  }

  async deleteTest(req: RequestAuth, res: Response) {
    if (!req.params.testId) {
      res.status(400).json({
        message: "Test ID is required",
      });
      return;
    }

    if (!req.userEmail) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    const { testId } = req.params;

    const deleteTest = await testInstance.deleteTest(Number(testId));

    if (!deleteTest) {
      res.status(404).json({
        message: "Test not found",
      });
      return;
    }

    res.status(200).json(deleteTest);
  }

  async findListsMany(req: RequestAuth, res: Response) {
    if (!req.userEmail) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    const findLists = await testInstance.findListsByUserId(req.userEmail);

    if (!findLists) {
      res.status(404).json({
        message: "Test not found",
      });
      return;
    }

    res.status(200).json(findLists);
  }

  async runTestsInternal(req: RequestAuth, res: Response) {
    const validateSchemaRun = TestSchema.safeParse(req.body);

    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    if (!validateSchemaRun.success) {
      res.status(400).json({
        message: validateSchemaRun.error.flatten().fieldErrors,
      });
      return;
    }

    const runTest = await runTests(validateSchemaRun.data, req.userId);

    if (!runTest) {
      res.status(404).json({
        message: "Test not found",
      });
      return;
    }

    res.status(200).json(runTest);
  }

  async runLoadTestsInternal(req: RequestAuth, res: Response) {
    const validateLoadSchema = TestLoadSchema.safeParse(req.body);

    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
      return;
    }

    if (!validateLoadSchema.success) {
      res.status(400).json({
        message: validateLoadSchema.error.flatten().fieldErrors,
        error: "Invalid schema",
      });

      return;
    }

    const runLoadTest = await loadTestInstance.autoCannonCallback(
      validateLoadSchema.data,
      req.userId,
    );

    if (!runLoadTest) {
      res.status(404).json({
        message: "Test not found",
      });
      return;
    }

    res.status(200).json(runLoadTest);
  }

  async testRunsByUserId(req: RequestAuth, res: Response) {
    if (!req.userId) {
      res.status(401).json({
        message: "Unauthorized, token not found",
      });
    }

    const userTestsLogged = await testRunsInstance.testRunsById(
      Number(req.userId),
    );

    if (!userTestsLogged) {
      res.status(404).json({
        message: "Tests logs not found",
      });
      return;
    }

    res.status(200).json(userTestsLogged);
  }
}
