import { UserController } from "../controllers/user.controller";
import { UserService } from "../services/user.service";

export const userInstance = new UserService();
export const userControllerInstance = new UserController();
