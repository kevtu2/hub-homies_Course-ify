import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  try {
    // Create users table first
    if (!(await db.schema.hasTable('users'))) {
      await db.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('u_id').primary();
        table.text('email').notNullable().unique();
        table.text('pwd').notNullable();
        table.text('name').notNullable();
      });

      // Insert initial users
      await db('users').insert([
        { email: 'user1@example.com', pwd: 'password1', name: 'User One' },
        { email: 'user2@example.com', pwd: 'password2', name: 'User Two' },
      ]).onConflict('email').ignore();
    }

    // Create courses table
    if (!(await db.schema.hasTable('courses'))) {
      await db.schema.createTable('courses', (table: Knex.TableBuilder) => {
        table.increments('c_id').primary();
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.text('title').notNullable();
        table.text('subject').notNullable();
        table.text('link').notNullable();
        table.text('added_date').notNullable();
        table.text('c_text').notNullable();
      });

      // Insert courses with valid user references
      await db('courses').insert([
        {
          u_id: 1,
          c_text: "goodbye",
          title: 'Intro to Programming',
          subject: 'Computer Science',
          link: 'https://www.example.com',
          added_date: '2023-02-01',
        },
        {
          u_id: 2,
          c_text: "hello",
          title: 'Advanced Mathematics',
          subject: 'Mathematics',
          link: 'https://www.math.com',
          added_date: '2023-02-02',
        },
      ]).onConflict('title').ignore();
    }

    // Create sections table
    if (!(await db.schema.hasTable('sections'))) {
      await db.schema.createTable('sections', (table: Knex.TableBuilder) => {
        table.increments('s_id').primary();
        table.integer('c_id').unsigned().references('c_id').inTable('courses').notNullable();
        table.integer('position').unsigned().notNullable();
        table.text('s_name').notNullable();
        table.text('s_text').notNullable();
        table.unique(['c_id', 'position']);
      });

      // Insert sections for first course
      await db('sections').insert([
        { c_id: 1, position: 1, s_name: 'Section 1', s_text: 'Introduction to Variables' },
        { c_id: 1, position: 2, s_name: 'Section 2', s_text: 'Control Structures' },
      ]).onConflict(['c_id', 'position']).ignore();
    }

    // Create questions table
    if (!(await db.schema.hasTable('questions'))) {
      await db.schema.createTable('questions', (table: Knex.TableBuilder) => {
        table.increments('q_id').primary();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.integer('position').unsigned().notNullable();
        table.text('q_text').notNullable();
        table.integer('q_ans').notNullable();
        table.text('a1_text').notNullable();
        table.text('a2_text').notNullable();
        table.text('a3_text').notNullable();
        table.text('a4_text').notNullable();
        table.unique(['s_id', 'position']);
      });

      // Insert questions for first section
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
      ]).onConflict(['s_id', 'position']).ignore();
    }

    // Create section_finished table
    if (!(await db.schema.hasTable('section_finished'))) {
      await db.schema.createTable('section_finished', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 's_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.timestamp('date_finished').defaultTo(db.fn.now());
      });
    }

    // Create follows table
    if (!(await db.schema.hasTable('follows'))) {
      await db.schema.createTable('follows', (table: Knex.TableBuilder) => {
        table.primary(['flwer', 'flwee']);
        table.integer('flwer').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('flwee').unsigned().references('u_id').inTable('users').notNullable();
        table.timestamp('date_followed').defaultTo(db.fn.now());
      });
    }

    // Create achievements table
    if (!(await db.schema.hasTable('achievements'))) {
      await db.schema.createTable('achievements', (table: Knex.TableBuilder) => {
        table.increments('ach_id').primary();
        table.string('ach_name', 255).notNullable().unique(); // Fixed length for unique constraint
        table.text('ach_text').notNullable();
      });
    
      // Optional: Insert initial achievements if needed
      await db('achievements').insert([
        { ach_name: 'First Course', ach_text: 'Complete your first course' },
        { ach_name: 'Perfect Score', ach_text: 'Get 100% on a quiz' }
      ]).onConflict('ach_name').ignore();
    }

    // Create has_achievement table
    if (!(await db.schema.hasTable('has_achievement'))) {
      await db.schema.createTable('has_achievement', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 'ach_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('ach_id').unsigned().references('ach_id').inTable('achievements').notNullable();
        table.timestamp('date_achieved').defaultTo(db.fn.now());
      });
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Failed to set up the database:', error);
  }
}