import { Request } from "express";
import { JwtPayload } from "jsonwebtoken";
export type RequestAuth = Request & {
  user?: JwtPayload | string;
};
