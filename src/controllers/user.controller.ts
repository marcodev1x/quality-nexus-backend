import { Request, Response } from "express";
import {
  UserSchema,
  UserSchemaDelete,
  UserSchemaLogin,
  UserSchemaUpdate,
} from "../models/User.model";
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

  async deleteUser(req: Request, res: Response) {
    const validateRequestDTO = UserSchemaDelete.safeParse(req.body);

    if (!validateRequestDTO.success) {
      res.status(400).json({
        message: validateRequestDTO.error.flatten().fieldErrors,
      });
      return;
    }

    const userDelete = await userInstance.deleteUser(
      validateRequestDTO.data.email,
    );

    if (!userDelete) {
      res.status(404).json({
        message: "User not deleted, user not found.",
      });
      return;
    }

    res.status(200).json({
      message: "User deleted successfully",
      userDeletedEmail: userDelete.email,
    });
  }

  async updateUser(req: Request, res: Response) {
    const validateRequestDTO = UserSchemaUpdate.safeParse(req.body);

    if (!validateRequestDTO.success) {
      res.status(400).json({
        message: validateRequestDTO.error.flatten().fieldErrors,
      });
      return;
    }

    const userUpdate = await userInstance.updateUser(validateRequestDTO.data);

    if (!userUpdate) {
      res.status(404).json({
        message: "User not updated, user not found.",
      });
      return;
    }

    res.status(201).json({
      message: "User updated successfully",
      user: userUpdate,
    });
  }
}
