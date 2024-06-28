import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('meals', (table) => {
    table.uuid('id').primary().notNullable()
    table.text('title').notNullable()
    table.text('description').notNullable()
    table.datetime('date').notNullable()
    table.boolean('is_inside_the_diet').notNullable()
    table.foreign('user_id').references('id').inTable('users')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('meals')
}

