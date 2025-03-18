import { Router } from "express";
import { Request, Response } from "express";
import userRouter from "./user.route";
import protectedRouter from "./protected.route";
import testRouter from "./test.route";

const index = Router();

index.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

index.use("/user", userRouter);
index.use("/protected", protectedRouter);
index.use("/tests", testRouter);

export default index;
