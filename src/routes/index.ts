import { Request, Response, Router } from "express";
import userRouter from "./user.route";
import protectedRouter from "./protected.route";
import testRouter from "./test.route";
import checkoutRoute from "./checkout.route.ts";

const index = Router();

index.get("/", (req: Request, res: Response) => {
  res.json({ message: "Hello World!" });
});

index.use("/user", userRouter);
index.use("/protected", protectedRouter);
index.use("/tests", testRouter);
index.use("/payments", checkoutRoute);

export default index;
