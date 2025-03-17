import { Request, Response } from "express";
import { UserSchema, UserSchemaLogin } from "../models/User.model";
import { UserService } from "../services/user.service";

const userInstance = new UserService();

export class UserController {
  async registerUser(req: Request, res: Response) {
    const validateRequestDTO = UserSchema.safeParse(req.body);

    if (!validateRequestDTO.success) {
      res.status(400).json({
        message: validateRequestDTO.error.flatten().fieldErrors,
      });
      return;
    }

    const verifyExists = await userInstance.findUser(
      validateRequestDTO.data.email,
    );

    if (verifyExists) {
      res.status(409).json({
        message: "User already exists",
      });
      return;
    }

    const userReg = await userInstance.createUser(validateRequestDTO.data);

    if (!userReg) {
      res.status(500).json({
        message: "User not registered",
      });
      return;
    }

    res.status(201).json({
      message: "User registered successfully",
      user: userReg,
    });
  }

  async login(req: Request, res: Response) {
    const validateRequestDTO = UserSchemaLogin.safeParse(req.body);

    if (!validateRequestDTO.success) {
      res.status(400).json({
        message: validateRequestDTO.error.flatten().fieldErrors,
      });
      return;
    }

    const user = await userInstance.login(
      validateRequestDTO.data.email,
      validateRequestDTO.data.password,
    );

    if (!user) {
      res.status(401).json({
        message: "Invalid credentials",
      });
      return;
    }

    res.status(200).json({
      message: "User logged in successfully",
      user,
    });
  }
}
