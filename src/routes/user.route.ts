import { Router } from "express";
import { userControllerInstance } from "../instances/user.instance";
import { authMiddleware } from "../middlewares/auth";

const userRouter = Router();

userRouter.post("/register", userControllerInstance.registerUser);
userRouter.post("/login", userControllerInstance.login);
userRouter.delete("/delete", authMiddleware, userControllerInstance.deleteUser);
userRouter.put("/update", authMiddleware, userControllerInstance.updateUser);
userRouter.get("/public", authMiddleware, userControllerInstance.publicUser);
userRouter.get("/quantity-access", authMiddleware, userControllerInstance.getUserQuantityAccess);
userRouter.post("/form-answer", authMiddleware, userControllerInstance.insertFormAnswer);
userRouter.get("/form-answer/:formCode", authMiddleware, userControllerInstance.getUserIfAnsweredSameSpecificForm);
userRouter.get("/:email", userControllerInstance.getUser);

export default userRouter;
