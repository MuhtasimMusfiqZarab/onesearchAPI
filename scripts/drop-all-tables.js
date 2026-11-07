require('dotenv').config();

const readline = require('readline');
const { Client } = require('pg');

const confirmationText = 'DROP ALL TABLES';

function askForConfirmation() {
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    interface.question(
      `This will permanently remove all objects in the public schema. Type "${confirmationText}" to continue: `,
      answer => {
        interface.close();
        resolve(answer === confirmationText);
      },
    );
  });
}

async function dropAllTables() {
  if (!(await askForConfirmation())) {
    console.log('Database reset cancelled.');
    return;
  }

  const client = new Client({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    await client.connect();
    await client.query('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
    console.log('All objects in the public schema were dropped.');
  } finally {
    await client.end();
  }
}

dropAllTables().catch(error => {
  console.error('Failed to reset the database:', error.message);
  process.exitCode = 1;
});
