import { User } from "./../models/User.model";
export type UserId = User & { id: number, quantity_access: number };
