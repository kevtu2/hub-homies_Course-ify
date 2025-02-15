import knex from 'knex';

const db = knex({
  client: 'mysql2',
  connection: {
    host: 'localhost',
    user: 'user',
    password: 'userpassword',
    database: 'mydatabase',
    port: 3306,
  },
});

export { db };
