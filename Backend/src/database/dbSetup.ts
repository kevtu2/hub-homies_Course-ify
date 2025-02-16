import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  await clearAll();

  try {
    if ((await db.schema.hasTable('users')) == false) {
      await db.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('u_id').primary();
        table.text('email').notNullable();
        table.text('pwd').notNullable();
        table.text('name').notNullable();
      });
    }
    await db('users').insert([
      { email: 'user1@example.com', pwd: 'password1', name: 'User One' },
      { email: 'user2@example.com', pwd: 'password2', name: 'User Two' },
    ]);

    if ((await db.schema.hasTable('courses')) == false) {
      await db.schema.createTable('courses', (table: Knex.TableBuilder) => {
        table.increments('c_id').primary();
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.text('title').notNullable();
        table.text('subject').notNullable();
        table.text('link').notNullable();
        table.text('added_date').notNullable();
      });
    }
    if ((await db.schema.hasColumn('courses', 'c_text')) == false) {
      await db.schema.alterTable('courses', (table: Knex.TableBuilder) => {
        table.text('c_text').notNullable();
      });
    }
    await db('courses').insert([
      {
        u_id: 1,
        title: 'Intro to Programming',
        subject: 'Computer Science',
        link: 'https://www.example.com',
        added_date: '2023-02-01',
      },
      {
        u_id: 2,
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        link: 'https://www.math.com',
        added_date: '2023-02-02',
      },
    ]);
    if ((await db.schema.hasTable('sections')) == false) {
      await db.schema.createTable('sections', (table: Knex.TableBuilder) => {
        table.increments('s_id').primary();
        table.integer('c_id').unsigned().references('c_id').inTable('courses').notNullable();
        table.integer('position').unsigned().notNullable().unique();
        table.text('s_name').notNullable();
        table.text('s_text').notNullable();
      });
    }
    await db('sections').insert([
      { c_id: 1, position: 1, s_name: 'Section 1', s_text: 'Introduction to Variables' },
      { c_id: 1, position: 2, s_name: 'Section 2', s_text: 'Control Structures' },
    ]);

    if ((await db.schema.hasTable('section_finished')) == false) {
      await db.schema.createTable('section_finished', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 's_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.timestamp('date_finished').defaultTo(db.fn.now());
      });
    }

    if ((await db.schema.hasTable('questions')) == false) {
      await db.schema.createTable('questions', (table: Knex.TableBuilder) => {
        table.increments('q_id').primary();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.integer('position').unsigned().notNullable().unique();
        table.text('q_text').notNullable();
        table.integer('q_ans').notNullable();

        table.text('a1_text').notNullable();
        table.text('a2_text').notNullable();
        table.text('a3_text').notNullable();
        table.text('a4_text').notNullable();
      });
    }
    await db('questions').insert([
      {
        s_id: 1,
        position: 1,
        q_text: 'What is a variable?',
        q_ans: 1,
        a1_text: 'A storage location',
        a2_text: 'A data type',
        a3_text: 'A function',
        a4_text: 'None of the above',
      },
      {
        s_id: 1,
        position: 2,
        q_text: 'Which keyword declares a variable in JavaScript?',
        q_ans: 2,
        a1_text: 'varr',
        a2_text: 'var',
        a3_text: 'variable',
        a4_text: 'v',
      },
    ]);

    if ((await db.schema.hasTable('user_answered')) == false) {
      await db.schema.createTable('user_answered', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 'q_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('q_id').unsigned().references('q_id').inTable('questions').notNullable();
        table.integer('a_picked').unsigned().notNullable();
        table.timestamp('date_answered').defaultTo(db.fn.now());
      });
    }

    if ((await db.schema.hasTable('follows')) == false) {
      await db.schema.createTable('follows', (table: Knex.TableBuilder) => {
        table.primary(['flwer', 'flwee']);
        table.integer('flwer').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('flwee').unsigned().references('u_id').inTable('users').notNullable();
        table.timestamp('date_followed').defaultTo(db.fn.now());
      });
    }

    if ((await db.schema.hasTable('achievements')) == false) {
      await db.schema.createTable('achievements', (table: Knex.TableBuilder) => {
        table.increments('ach_id').primary();
        table.text('ach_name').notNullable();
        table.text('ach_text').notNullable();
      });
    }

    if ((await db.schema.hasTable('has_achievement')) == false) {
      await db.schema.createTable('has_achievement', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 'ach_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table
          .integer('ach_id')
          .unsigned()
          .references('ach_id')
          .inTable('achievements')
          .notNullable();
        table.timestamp('date_achieved').defaultTo(db.fn.now());
      });
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.log('Failed to set up the database:', error);
  }
}

export async function clearAll() {
  await db.raw('SET FOREIGN_KEY_CHECKS = 0');
  await db.schema.dropTableIfExists('achievements'),
    await db.schema.dropTableIfExists('courses'),
    await db.schema.dropTableIfExists('follows'),
    await db.schema.dropTableIfExists('has_achievement'),
    await db.schema.dropTableIfExists('questions'),
    await db.schema.dropTableIfExists('section_finished'),
    await db.schema.dropTableIfExists('sections'),
    await db.schema.dropTableIfExists('user_answered'),
    await db.schema.dropTableIfExists('users');
  await db.raw('SET FOREIGN_KEY_CHECKS = 1');
}
