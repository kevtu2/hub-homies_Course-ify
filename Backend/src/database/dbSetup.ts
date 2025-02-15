import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  await db.schema.hasTable('books').then(async exists => {
    if (!exists) {
      await db.schema.createTable('books', (table: Knex.TableBuilder) => {
        table.increments('id').primary();
        table.string('title').notNullable();
        table.string('author').notNullable();
        table.date('date_published').notNullable();
        table.timestamp('date_added').notNullable().defaultTo(db.fn.now());
      });
    }
  });

  console.log('MySQL connection established successfully.');
}
