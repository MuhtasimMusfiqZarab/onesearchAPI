require('dotenv').config();

const readline = require('readline');
const sqlite3 = require('sqlite3').verbose();

const confirmationText = 'DROP ALL TABLES';

function askForConfirmation() {
  const interface = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => {
    interface.question(
      `This will permanently remove all objects from the SQLite database. Type "${confirmationText}" to continue: `,
      answer => {
        interface.close();
        resolve(answer === confirmationText);
      },
    );
  });
}

function run(database, sql) {
  return new Promise((resolve, reject) => {
    database.run(sql, error => (error ? reject(error) : resolve()));
  });
}

function all(database, sql) {
  return new Promise((resolve, reject) => {
    database.all(sql, (error, rows) => (error ? reject(error) : resolve(rows)));
  });
}

async function dropAllTables() {
  if (!(await askForConfirmation())) {
    console.log('Database reset cancelled.');
    return;
  }

  const database = new sqlite3.Database(
    process.env.SQLITE_DATABASE || 'onesearch.sqlite',
  );

  try {
    await run(database, 'PRAGMA foreign_keys = OFF');
    const objects = await all(
      database,
      `SELECT name, type
       FROM sqlite_master
       WHERE (type = 'table' OR type = 'view')
         AND name NOT LIKE 'sqlite_%'`,
    );

    for (const object of objects) {
      await run(
        database,
        `DROP ${object.type.toUpperCase()} IF EXISTS "${object.name.replace(
          /"/g,
          '""',
        )}"`,
      );
    }

    console.log('All SQLite tables and views were dropped.');
  } finally {
    await new Promise((resolve, reject) =>
      database.close(error => (error ? reject(error) : resolve())),
    );
  }
}

dropAllTables().catch(error => {
  console.error('Failed to reset the database:', error.message);
  process.exitCode = 1;
});
