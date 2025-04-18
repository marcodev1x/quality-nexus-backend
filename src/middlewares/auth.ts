import { validateToken } from "./../utils/jwt.utils";
import { NextFunction, Response } from "express";
import { RequestAuth } from "../types/RequestAuth";

export const authMiddleware = (
  req: RequestAuth,
  res: Response,
  next: NextFunction,
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({
      message: "Unauthorized, token not found",
    });
    return;
  }

  try {
    const decodedToken = validateToken(token) as {
      userEmail: string;
      userId: number;
    };
    req.userEmail = decodedToken.userEmail;
    req.userId = decodedToken.userId;
    console.log(decodedToken);
    next();
  } catch (err) {
    res.status(403).json({
      message: "Unauthorized, invalid token",
    });
    return;
  }
};
