import dotenv from "dotenv";

dotenv.config();

export class EnvsVars {
  static PORT = process.env.PORT;
  static DB_CLIENT = process.env.DB_CLIENT;
  static DB_HOST = process.env.DB_HOST;
  static DB_PORT = process.env.DB_PORT;
  static DB_USER = process.env.DB_USER;
  static DB_PASSWORD = process.env.DB_PASSWORD;
  static DB_DATABASE = process.env.DB_DATABASE;
  static SECRET_KEY = process.env.SECRET_KEY;
  static STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
}
