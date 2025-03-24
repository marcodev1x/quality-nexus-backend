import jwt from "jsonwebtoken";
import { EnvsVars } from "../EnvsVars";

export const generateToken = (userEmail: string) => {
  return jwt.sign({ userEmail }, EnvsVars.SECRET_KEY as string, {
    algorithm: "HS256",
    encoding: "utf-8",
  });
};

export const validateToken = (token: string) => {
  return jwt.verify(token, EnvsVars.SECRET_KEY as string);
};
