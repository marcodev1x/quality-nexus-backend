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
      .select("id", "nome", "email", "createdAt")
      .where("email", user.email)
      .first();
    return {
      registeredUser,
      token: generateToken(registeredUser.email, registeredUser.id),
    };
  }

  async findUser(email: string) {
    return db("TODO_USER")
      .select("email", "nome", "role", "stripe_subscription_id")
      .where("email", email)
      .first();
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
      quantityAccess: user.quantity_access,
      token: generateToken(user.email, user.id),
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
    if (!userToUpdate) return "Usuário não encontrado";

    if (!data.newEmail) return;

    const verifyIfNewEmailExists = await this.findUserSecrettly(data.newEmail);

    if (verifyIfNewEmailExists) return "Email já existe";

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

  async getAllUsers() {
    return db("TODO_USER").select("id", "nome", "email", "createdAt");
  }

  async updateUserQuantityAccess(email: string) {
    const userToUpdate = await this.findUserSecrettly(email);
    if (!userToUpdate) return "Usuário não encontrado";

    await db("TODO_USER")
      .update({
        quantity_access: userToUpdate.quantity_access + 1,
      })
      .where("email", email);

    return { userChanged: true };
  }

  async getUserQuantityAccess(email: string){
    const user = await this.findUserSecrettly(email);
    if (!user) return "Usuário não encontrado";

    return user.quantity_access;
  }

  async insertFormAnswer(email: string, formCode: string) {
    const user = await this.findUserSecrettly(email);
    if (!user) return "Usuário não encontrado";

    await db("FORMS").insert({
      user_id: user.id,
      formCode: formCode,
    });

    return true;
  }

  async getIfUserAnsweredSpecificForm(email: string, formCode: string){
    const user = await this.findUserSecrettly(email);
    if (!user) return "Usuário não encontrado";

    const formAnswer = await db("FORMS").where("user_id", user.id).where("formCode", formCode).first();

    if(!formAnswer) return false;

    return true;
  }
}
