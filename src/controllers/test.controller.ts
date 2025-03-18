import { Response } from "express";
import { TestService } from "../services/test.service";
import { TestSchema } from "../models/Test.model";
import { RequestAuth } from "../types/RequestAuth";

const testInstance = new TestService();

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

    res.status(201).json(registerTest);
  }
}
