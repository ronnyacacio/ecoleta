import Knex from 'knex';

export async function up(knex: Knex): Promise<any> {
  return knex.schema.createTable('items', (table) => {
    table.increments('id').primary();
    table.string('title').notNullable();
    table.string('image').notNullable();
  });
}

export async function down(knex: Knex): Promise<any> {
  return knex.schema.dropTable('items');
}
