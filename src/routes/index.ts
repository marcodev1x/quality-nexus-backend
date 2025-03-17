import { Router } from "express";
import { Request, Response } from "express";
import userRouter from "./user.route";
import protectedRouter from "./protected.route";

const index = Router();

index.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

index.use("/user", userRouter);
index.use("/protected", protectedRouter);

export default index;
