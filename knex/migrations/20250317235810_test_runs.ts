import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.createTable("test_runs", (table) => {
    table.increments("id").primary().unsigned();
    table
      .integer("testId")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("tests")
      .onDelete("CASCADE");
    table
      .enum("status", ["queued", "running", "completed", "failed"])
      .defaultTo("queued");
    table.float("duration");
    table.json("results");
    table.dateTime("createdAt").defaultTo(knex.fn.now());
    table.dateTime("updatedAt").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {}
