import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  try {
    //
    // 1) DROP TABLES in reverse dependency order
    //
    await db.schema.dropTableIfExists('Got_right');
    await db.schema.dropTableIfExists('Got_wrong');
    await db.schema.dropTableIfExists('Answers');
    await db.schema.dropTableIfExists('Questions');
    await db.schema.dropTableIfExists('Sections_Finished');
    await db.schema.dropTableIfExists('Sections');
    await db.schema.dropTableIfExists('Courses');
    await db.schema.dropTableIfExists('Users');

    //
    // 2) CREATE TABLES in forward dependency order
    //

    // 2.1) "Users"
    await db.schema.createTable('Users', (table: Knex.TableBuilder) => {
      table.increments('u_id').primary();
      table.string('email').notNullable();
      table.string('pwd').notNullable();
      table.string('name').notNullable();
    });

    // 2.2) "Courses"
    await db.schema.createTable('Courses', (table: Knex.TableBuilder) => {
      table.increments('id').primary();
      table.string('title').notNullable();
      table.string('subject').notNullable();
      table.string('link').notNullable();
      table.integer('u_id').unsigned().notNullable();
      table.timestamp('date_added').defaultTo(db.fn.now());

      table
        .foreign('u_id')
        .references('u_id')
        .inTable('Users')
        .onDelete('NO ACTION'); // Or CASCADE, etc.
    });

    // 2.3) "Sections" – Weak entity of "Courses" (composite PK: (order, c2_id))
    await db.schema.createTable('Sections', (table: Knex.TableBuilder) => {
      table.text('s_text').notNullable();
      table.string('s_name').notNullable();

      // Composite key
      table.integer('order').unsigned().notNullable();
      table.integer('c2_id').unsigned().notNullable();
      table.integer('u2_id').unsigned().notNullable();
      table.timestamp('f_date').notNullable();
      table.primary(['order', 'c2_id', 'u2_id']);

      table
        .foreign('c2_id')
        .references('id')
        .inTable('Courses')
        .onDelete('CASCADE');

      table
        .foreign('u2_id')
        .references('u_id')
        .inTable('Users')
        .onDelete('CASCADE');
    });

    // 2.5) "Questions" – Weak entity of "Sections" (references composite PK (order, c2_id))
    await db.schema.createTable('Questions', (table: Knex.TableBuilder) => {
      table.increments('q_id').primary();
      table.text('text').notNullable();
      table.string('right_answer').notNullable();

      table.integer('section_order').unsigned().notNullable();
      table.integer('section_c2_id').unsigned().notNullable();
      table.integer('section_u2_id').unsigned().notNullable();

      table
        .foreign(['section_order', 'section_c2_id', 'section_u2_id'])
        .references(['order', 'c2_id', 'u2_id'])
        .inTable('Sections')
        .onDelete('CASCADE');
    });

    // 2.6) "Answers" – NEW weak entity of "Questions"
    //      Composite PK: (q_id, a_id).
    await db.schema.createTable('Answers', (table: Knex.TableBuilder) => {
      table.integer('q_id').unsigned().notNullable();
      table.integer('a_id').unsigned().notNullable();
      table.text('text').notNullable(); // The answer content

      // Composite primary key
      table.primary(['q_id', 'a_id']);

      // Foreign key referencing "Questions"
      table
        .foreign('q_id')
        .references('q_id')
        .inTable('Questions')
        .onDelete('CASCADE');
    });

    // 2.7) "Got_wrong" – Relationship among (User, Answer), includes w_date
    //      – now references the answer's composite key (q_id, a_id)
    await db.schema.createTable('Got_wrong', (table: Knex.TableBuilder) => {
      table.integer('u2_id').unsigned().notNullable();
      table.integer('q2_id').unsigned().notNullable();
      table.integer('a2_id').unsigned().notNullable();
      table.timestamp('w_date').defaultTo(db.fn.now());

      // Composite PK
      table.primary(['u2_id', 'q2_id', 'a2_id']);

      // Foreign key to "Users"
      table
        .foreign('u2_id')
        .references('u_id')
        .inTable('Users')
        .onDelete('CASCADE');

      // Foreign key to "Answers" (which is a weak entity of "Questions")
      table
        .foreign(['q2_id', 'a2_id'])
        .references(['q_id', 'a_id'])
        .inTable('Answers')
        .onDelete('CASCADE');
    });

    // 2.8) "Got_right" – Relationship among (User, Answer), includes r_date
    //      – same pattern as "Got_wrong"
    await db.schema.createTable('Got_right', (table: Knex.TableBuilder) => {
      table.integer('u2_id').unsigned().notNullable();
      table.integer('q2_id').unsigned().notNullable();
      table.integer('a2_id').unsigned().notNullable();
      table.timestamp('r_date').defaultTo(db.fn.now());

      // Composite PK
      table.primary(['u2_id', 'q2_id', 'a2_id']);

      // Foreign key to "Users"
      table
        .foreign('u2_id')
        .references('u_id')
        .inTable('Users')
        .onDelete('CASCADE');

      // Foreign key to "Answers"
      table
        .foreign(['q2_id', 'a2_id'])
        .references(['q_id', 'a_id'])
        .inTable('Answers')
        .onDelete('CASCADE');
    });

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.error('Failed to set up the database:', error);
  }
}
