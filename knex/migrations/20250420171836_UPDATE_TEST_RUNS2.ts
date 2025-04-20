import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return await knex.schema.alterTable("test_runs", (table) => {
    table.bigInteger("userId").defaultTo(null).alter();
  });
}

export async function down(knex: Knex): Promise<void> {
  return knex.schema.alterTable("test_runs", (table) => {
    // Use o mesmo tipo aqui para reverter
    table
      .bigInteger("userId") // ou table.bigInteger("userId"), etc.
      .defaultTo(null) // Ou a lógica correta para remover o default no seu DB
      .alter();
  });
}
