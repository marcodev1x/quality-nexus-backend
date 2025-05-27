import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  return knex.schema.alterTable("TODO_USER", (tableBuilder) => {
    tableBuilder.string("stripe_subscription_id");
  });
}

export async function down(knex: Knex): Promise<void> {}
