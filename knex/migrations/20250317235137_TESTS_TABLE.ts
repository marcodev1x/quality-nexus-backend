import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("tests", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .notNullable()
      .references("id")
      .inTable("TODO_USER")
      .unsigned()
      .onDelete("CASCADE");
    table.text("description").notNullable();
    table.enum("type", ["load", "performance", "integration"]).notNullable();
    table.json("config");
    table.dateTime("createdAt").defaultTo(knex.fn.now());
    table.dateTime("updatedAt").defaultTo(knex.fn.now());
    table.dateTime("deletedAt").defaultTo(null);
  });
}

export async function down(knex: Knex): Promise<void> {}
