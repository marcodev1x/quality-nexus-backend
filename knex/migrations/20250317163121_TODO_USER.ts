import type { Knex, TableBuilder } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("TODO_USER", (table) => {
    table.increments("id").primary().unsigned();
    table.string("email").notNullable().unique();
    table.string("password").notNullable();
    table.dateTime("createdAt").defaultTo(knex.fn.now());
    table.dateTime("updatedAt").defaultTo(knex.fn.now());
    table.dateTime("deletedAt").defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {}
