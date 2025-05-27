import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("test_runs", (table) => {
    table.bigInteger("userId").defaultTo(null).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("test_runs", (table) => {
    table.bigInteger("userId").defaultTo(null).alter();
  });
}
