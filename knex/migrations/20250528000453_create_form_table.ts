import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  return knex.schema.createTable('FORMS', (queryBuilder) => {
    queryBuilder.increments('id').primary().unsigned();
    queryBuilder
    .integer("user_id")
    .notNullable()
    .references("id")
    .inTable("TODO_USER")
    .unsigned()
    .onDelete("CASCADE");
    queryBuilder.string('formCode').notNullable();
    queryBuilder.dateTime('createdAt').defaultTo(knex.fn.now());
    queryBuilder.dateTime('updatedAt').defaultTo(knex.fn.now());
    queryBuilder.dateTime('deletedAt').defaultTo(null);
  })
}


export async function down(knex: Knex): Promise<void> {
}

