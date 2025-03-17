import { Router } from "express";
import { UserController } from "../controllers/user.controller";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/register", userController.registerUser);
userRouter.post("/login", userController.login);

export default userRouter;
