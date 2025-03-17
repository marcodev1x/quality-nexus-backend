import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("TODO_USER", (table) => {
    table.string("nome").notNullable();
  });
}

export async function down(knex: Knex): Promise<void> {}
