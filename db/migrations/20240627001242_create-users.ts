import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().index()
    table.text('name').notNullable()
    table.text('avatar_url')
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()

  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users')
}

