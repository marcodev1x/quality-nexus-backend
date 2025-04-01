import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("tests", (table) => {
    table.dropColumn("duration");
  });
}

export async function down(knex: Knex): Promise<void> {}
