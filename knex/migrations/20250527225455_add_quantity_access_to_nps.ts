import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("TODO_USER", (queryBuilder) => {
    queryBuilder.integer("quantity_access").defaultTo(0);
  });
}


export async function down(knex: Knex): Promise<void> {
}

