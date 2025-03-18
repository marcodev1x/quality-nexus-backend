import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("TODO_USER", (table) => {
    table.enum("role", ["free", "plan"]).defaultTo("free");
  });
}

export async function down(knex: Knex): Promise<void> {}
