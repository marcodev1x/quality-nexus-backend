import { Router } from "express";
import { userControllerInstance } from "../instances/user.instance";

const userRouter = Router();

userRouter.post("/register", userControllerInstance.registerUser);
userRouter.post("/login", userControllerInstance.login);

export default userRouter;
