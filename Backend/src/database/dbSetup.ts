import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  try {
    // Create all tables first
    await createTables();

    // Insert initial data in transaction
    await db.transaction(async trx => {
      // Insert or update users
      await trx('users').insert({
        email: 'user1@example.com',
        pwd: 'password1',
        name: 'User One'
      }).onConflict('email').merge();

      await trx('users').insert({
        email: 'user2@example.com',
        pwd: 'password2',
        name: 'User Two'
      }).onConflict('email').merge();

      // Get user IDs
      const user1 = await trx('users')
        .where('email', 'user1@example.com')
        .first();
      const user2 = await trx('users')
        .where('email', 'user2@example.com')
        .first();

      // Insert or update courses
      await trx('courses').insert({
        u_id: user1.u_id,
        title: 'Intro to Programming',
        subject: 'Computer Science',
        link: 'https://www.example.com',
        added_date: '2023-02-01',
        c_text: "goodbye"
      }).onConflict('title').merge(['added_date', 'c_text', 'link', 'subject']);

      await trx('courses').insert({
        u_id: user2.u_id,
        title: 'Advanced Mathematics',
        subject: 'Mathematics',
        link: 'https://www.math.com',
        added_date: '2023-02-02',
        c_text: "hello"
      }).onConflict('title').merge(['added_date', 'c_text', 'link', 'subject']);

      // Get course IDs
      const course1 = await trx('courses')
        .where('title', 'Intro to Programming')
        .first();

      // Insert sections
      await trx('sections').insert([
        {
          c_id: course1.c_id,
          position: 1,
          s_name: 'Section 1',
          s_text: 'Introduction to Variables'
        },
        {
          c_id: course1.c_id,
          position: 2,
          s_name: 'Section 2',
          s_text: 'Control Structures'
        }
      ]).onConflict(['c_id', 'position']).merge();

      // Get section IDs
      const section1 = await trx('sections')
        .where({
          c_id: course1.c_id,
          position: 1
        })
        .first();

      // Insert questions
      await trx('questions').insert([
        {
          s_id: section1.s_id,
          position: 1,
          q_text: 'What is a variable?',
          q_ans: 1,
          a1_text: 'A storage location',
          a2_text: 'A data type',
          a3_text: 'A function',
          a4_text: 'None of the above',
        },
        {
          s_id: section1.s_id,
          position: 2,
          q_text: 'Which keyword declares a variable in JavaScript?',
          q_ans: 2,
          a1_text: 'varr',
          a2_text: 'var',
          a3_text: 'variable',
          a4_text: 'v',
        }
      ]).onConflict(['s_id', 'position']).merge();

      // Insert achievements
      await trx('achievements').insert([
        { ach_name: 'First Course', ach_text: 'Complete your first course' },
        { ach_name: 'Perfect Score', ach_text: 'Get 100% on a quiz' }
      ]).onConflict('ach_name').merge();

      // Insert follows
      await trx('follows').insert([
        { flwer: user1.u_id, flwee: user2.u_id },
        { flwer: user2.u_id, flwee: user1.u_id }
      ]).onConflict(['flwer', 'flwee']).ignore();
    });

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Database setup failed:', error);
  }
}

async function createTables() {
  // Users table
  if (!await db.schema.hasTable('users')) {
    await db.schema.createTable('users', (table: Knex.TableBuilder) => {
      table.increments('u_id').primary();
      table.string('email', 255).notNullable().unique();
      table.string('pwd', 255).notNullable();
      table.string('name', 255).notNullable();
    });
  }

  // Courses table (with unique title constraint)
  if (!await db.schema.hasTable('courses')) {
    await db.schema.createTable('courses', (table: Knex.TableBuilder) => {
      table.increments('c_id').primary();
      table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
      table.string('title', 255).notNullable().unique();
      table.string('subject', 255).notNullable();
      table.text('link').notNullable();
      table.date('added_date').notNullable();
      table.text('c_text').notNullable();
    });
  }

  // Sections table
  if (!await db.schema.hasTable('sections')) {
    await db.schema.createTable('sections', (table: Knex.TableBuilder) => {
      table.increments('s_id').primary();
      table.integer('c_id').unsigned().references('c_id').inTable('courses').notNullable();
      table.integer('position').unsigned().notNullable();
      table.string('s_name', 255).notNullable();
      table.text('s_text').notNullable();
      table.unique(['c_id', 'position']);
    });
  }

  // Questions table
  if (!await db.schema.hasTable('questions')) {
    await db.schema.createTable('questions', (table: Knex.TableBuilder) => {
      table.increments('q_id').primary();
      table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
      table.integer('position').unsigned().notNullable();
      table.text('q_text').notNullable();
      table.integer('q_ans').notNullable().checkBetween([1, 4]);
      table.text('a1_text').notNullable();
      table.text('a2_text').notNullable();
      table.text('a3_text').notNullable();
      table.text('a4_text').notNullable();
      table.unique(['s_id', 'position']);
    });
  }

  // Section Finished table
  if (!await db.schema.hasTable('section_finished')) {
    await db.schema.createTable('section_finished', (table: Knex.TableBuilder) => {
      table.primary(['u_id', 's_id']);
      table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
      table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
      table.timestamp('date_finished').defaultTo(db.fn.now());
    });
  }

  // Follows table
  if (!await db.schema.hasTable('follows')) {
    await db.schema.createTable('follows', (table: Knex.TableBuilder) => {
      table.primary(['flwer', 'flwee']);
      table.integer('flwer').unsigned().references('u_id').inTable('users').notNullable();
      table.integer('flwee').unsigned().references('u_id').inTable('users').notNullable();
      table.timestamp('date_followed').defaultTo(db.fn.now());
    });
  }

  // Achievements table
  if (!await db.schema.hasTable('achievements')) {
    await db.schema.createTable('achievements', (table: Knex.TableBuilder) => {
      table.increments('ach_id').primary();
      table.string('ach_name', 255).notNullable().unique();
      table.text('ach_text').notNullable();
    });
  }

  // Has Achievement table
  if (!await db.schema.hasTable('has_achievement')) {
    await db.schema.createTable('has_achievement', (table: Knex.TableBuilder) => {
      table.primary(['u_id', 'ach_id']);
      table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
      table.integer('ach_id').unsigned().references('ach_id').inTable('achievements').notNullable();
      table.timestamp('date_achieved').defaultTo(db.fn.now());
    });
  }
}