import { db } from "../database";
import bcrypt from "bcrypt";
import { User } from "../models/User.model";
import { generateToken } from "../utils/jwt.utils";
import { UserId } from "../types/UserId";

export class UserService {
  async createUser(user: User): Promise<Object | null> {
    // # Hash user password
    const passwordHashed = bcrypt.hashSync(user.password, 10);

    const register = await db("TODO_USER").insert({
      nome: user.nome,
      email: user.email,
      password: passwordHashed,
    });

    if (!register) return null;

    const registeredUser = await db("TODO_USER")
      .select("nome", "email", "createdAt")
      .where("email", user.email)
      .first();
    return { registeredUser, token: generateToken(registeredUser.email) };
  }

  async findUser(email: string) {
    const userFound = await db("TODO_USER")
      .select("email", "nome", "role")
      .where("email", email)
      .first();

    return userFound;
  }

  async findUserSecrettly(email: string) {
    const userFound: UserId = await db("TODO_USER")
      .select("*")
      .where("email", email)
      .first();

    return userFound;
  }

  async login(email: string, password: string) {
    const user = await this.findUserSecrettly(email);

    if (!user) return null;

    const passwordMatch = bcrypt.compareSync(password, user.password);

    if (!passwordMatch) return null;

    return {
      nome: user.nome,
      email: user.email,
      token: generateToken(user.email),
    };
  }

  async deleteUser(email: string) {
    const userToDelete = await this.findUserSecrettly(email);

    if (!userToDelete) return null;

    const deletedUser = await db("TODO_USER").where("email", email).del();

    return { deletedUser, email };
  }

  async updateUser(data: {
    email: string;
    nome?: string;
    password?: string;
    newEmail?: string;
  }) {
    const userToUpdate = await this.findUserSecrettly(data.email);

    if (!userToUpdate) return null;

    await db("TODO_USER")
      .update({
        nome: data.nome || userToUpdate.nome,
        password: data.password
          ? bcrypt.hashSync(data.password, 10)
          : userToUpdate.password,
        email: data.newEmail || userToUpdate.email,
      })
      .where("email", data.email);

    return { userChanged: true };
  }
}
