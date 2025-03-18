import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable("logs", (table) => {
    table.increments("id").primary();
    table
      .integer("testRunId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("test_runs")
      .onDelete("CASCADE");
    table.text("message").notNullable();
    table.string("level").defaultTo("info");
    table.dateTime("createdAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}
