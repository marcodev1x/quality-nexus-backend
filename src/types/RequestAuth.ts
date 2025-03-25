import {Request} from "express";

export type RequestAuth = Request & {
  userEmail?: string;
  userId?: number;
};
