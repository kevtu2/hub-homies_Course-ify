import { Knex } from 'knex';
import { db } from './db';

export async function setupDatabase() {
  try {
    if (await db.schema.hasTable('users') == false) {
      await db.schema.createTable('users', (table: Knex.TableBuilder) => {
        table.increments('u_id').primary();
        table.string('email').notNullable();
        table.string('pwd').notNullable();
        table.string('name').notNullable();
      });
    }
    await db('users').insert([
      { email: 'user1@example.com', pwd: 'password1', name: 'User One' },
      { email: 'user2@example.com', pwd: 'password2', name: 'User Two' }
    ]);
    
    if (await db.schema.hasTable('courses') == false) {
      await db.schema.createTable('courses', (table: Knex.TableBuilder) => {
        table.increments('c_id').primary();
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.string('title').notNullable();
        table.string('subject').notNullable();
        table.string('link').notNullable();
        table.string('added_date').notNullable();
      });
    }
    await db('courses').insert([
      { u_id: 1, title: 'Intro to Programming', subject: 'Computer Science', link: 'https://www.example.com', added_date: '2023-02-01' },
      { u_id: 2, title: 'Advanced Mathematics', subject: 'Mathematics', link: 'https://www.math.com', added_date: '2023-02-02' }
    ]);
    if(await db.schema.hasTable('sections') == false) {
      await db.schema.createTable('sections', (table: Knex.TableBuilder) => {
        table.increments('s_id').primary();
        table.integer('c_id').unsigned().references('c_id').inTable('courses').notNullable();
        table.integer('position').unsigned().notNullable().unique();
        table.string('s_name').notNullable();
        table.string('s_text').notNullable();
      });
    }
    await db('sections').insert([
      { c_id: 1, position: 1, s_name: 'Section 1', s_text: 'Introduction to Variables' },
      { c_id: 1, position: 2, s_name: 'Section 2', s_text: 'Control Structures' }
    ]);

    if(await db.schema.hasTable('section_finished') == false) {
      await db.schema.createTable('section_finished', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 's_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.timestamp('date_finished').defaultTo(db.fn.now());
      });
    }

    if(await db.schema.hasTable('questions') == false) {
      await db.schema.createTable('questions', (table: Knex.TableBuilder) => {
        table.increments('q_id').primary();
        table.integer('s_id').unsigned().references('s_id').inTable('sections').notNullable();
        table.integer('position').unsigned().notNullable().unique();
        table.string('q_text').notNullable();
        table.integer('q_ans').notNullable();

        table.string('a1_text').notNullable();
        table.string('a2_text').notNullable();
        table.string('a3_text').notNullable();
        table.string('a4_text').notNullable();
      });
    }
    await db('questions').insert([
      { s_id: 1, position: 1, q_text: 'What is a variable?', q_ans: 1, a1_text: 'A storage location', a2_text: 'A data type', a3_text: 'A function', a4_text: 'None of the above' },
      { s_id: 1, position: 2, q_text: 'Which keyword declares a variable in JavaScript?', q_ans: 2, a1_text: 'varr', a2_text: 'var', a3_text: 'variable', a4_text: 'v' }
    ]);

    if(await db.schema.hasTable('user_answered') == false) {
      await db.schema.createTable('user_answered', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 'q_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('q_id').unsigned().references('q_id').inTable('questions').notNullable();
        table.integer('a_picked').unsigned().notNullable();
        table.timestamp('date_answered').defaultTo(db.fn.now());
      });
    }

    if(await db.schema.hasTable('follows') == false) {
      await db.schema.createTable('follows', (table: Knex.TableBuilder) => {
        table.primary(['flwer', 'flwee']);
        table.integer('flwer').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('flwee').unsigned().references('u_id').inTable('users').notNullable();
        table.timestamp('date_followed').defaultTo(db.fn.now());
      });
    }

    if(await db.schema.hasTable('achievements') == false) {
      await db.schema.createTable('achievements', (table: Knex.TableBuilder) => {
        table.increments('ach_id').primary();
        table.string('ach_name').notNullable();
        table.string('ach_text').notNullable();
      });
    }

    if(await db.schema.hasTable('has_achievement') == false) {
      await db.schema.createTable('has_achievement', (table: Knex.TableBuilder) => {
        table.primary(['u_id', 'ach_id']);
        table.integer('u_id').unsigned().references('u_id').inTable('users').notNullable();
        table.integer('ach_id').unsigned().references('ach_id').inTable('achievements').notNullable();
        table.timestamp('date_achieved').defaultTo(db.fn.now());
      });
    }

    console.log('Database setup completed successfully.');
  } catch (error) {
    console.log('Failed to set up the database:', error);
  }
  
}

/*
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
*/