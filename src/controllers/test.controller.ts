import { Response } from "express";
import {
  TestSchema,
  TestSchemaDelete,
  TestSchemaUpdate,
} from "../models/Test.model";
import { RequestAuth } from "../types/RequestAuth";
import { testInstance } from "../instances/test.instance.ts";

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
    const validateSchemaDelete = TestSchemaDelete.safeParse(req.body);

    if (!validateSchemaDelete.success) {
      res.status(400).json({
        message: validateSchemaDelete.error.flatten().fieldErrors,
      });
      return;
    }

    const deleteTest = await testInstance.deleteTest(
      validateSchemaDelete.data.testId,
    );

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

  private transformHeadersArrayToObject(headers: {key: string, value: string}[] | Record<string, string>): Record<string, string> {
    if (Array.isArray(headers)) {
      return headers.reduce((acc, {key, value}) => {
        acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
    }
    return headers;
  }
}
