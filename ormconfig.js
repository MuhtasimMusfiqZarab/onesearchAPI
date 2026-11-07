var dbConfig = {
  type: 'sqlite',
  database: process.env.SQLITE_DATABASE || 'onesearch.sqlite',
  entities: ['**/*.entity.js'],
  synchronize: true,
};

module.exports = dbConfig;
