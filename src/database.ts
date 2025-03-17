import knex from "knex";
import knexcfg from "../knexfile";

export const db = knex(knexcfg.development as any);
