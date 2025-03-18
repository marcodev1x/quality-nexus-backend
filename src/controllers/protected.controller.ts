import { Response, Request } from "express";
export class ProtectedController {
  handle(req: Request, res: Response) {
    res.json({ message: "Protected route" });
  }
}
