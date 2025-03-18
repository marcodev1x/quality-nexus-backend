import { TestController } from "./../controllers/test.controller";
import { TestService } from "../services/test.service";

export const testInstance = new TestService();
export const testControllerInstance = new TestController();
