import { Router } from "express";
import { userControllerInstance } from "../instances/user.instance";
import { authMiddleware } from "../middlewares/auth";

const userRouter = Router();

userRouter.post("/register", userControllerInstance.registerUser);
userRouter.post("/login", userControllerInstance.login);
userRouter.delete("/delete", authMiddleware, userControllerInstance.deleteUser);
userRouter.put("/update", authMiddleware, userControllerInstance.updateUser);

export default userRouter;
