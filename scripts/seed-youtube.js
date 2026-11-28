require('dotenv').config();

const { randomBytes } = require('crypto');
const { Client } = require('pg');

const CHANNEL_COUNT = 1000;
const BATCH_SIZE = 100;
const categories = [
  'Music',
  'Gaming',
  'Education',
  'Lifestyle',
  'Technology',
  'Comedy',
  'Travel',
  'Food',
  'News',
  'Fitness',
];

const locations = [
  'United States',
  'Canada',
  'United Kingdom',
  'India',
  'Brazil',
  'Germany',
  'Australia',
  'Japan',
  'South Africa',
  'France',
];

const columns = [
  'id',
  'channel_url',
  'socialblade_category',
  'bio_email',
  'subscribers',
  'location',
  'channel_name',
  'timestamp',
  'description',
  'instagram',
  'twitter',
  'facebook',
  'tiktok',
  'pinterest',
  'others',
  'joined',
  'views',
  'created_at',
  'createdBy',
  'updated_at',
  'updatedBy',
];

function createUuid() {
  const bytes = randomBytes(16);
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(
    12,
    16,
  )}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function createSeedChannels() {
  const runId = createUuid().replace(/-/g, '');
  const now = new Date();

  return Array.from({ length: CHANNEL_COUNT }, (_, index) => {
    const number = index + 1;
    const channelName = `Seed Creator ${String(number).padStart(4, '0')}`;
    const handle = `seedcreator${number}`;
    const subscribers = number * 12000;
    const channelUrl = `https://www.youtube.com/channel/UC${runId.slice(
      0,
      20,
    )}${String(number).padStart(4, '0')}`;

    return [
      createUuid(),
      channelUrl,
      categories[index % categories.length],
      JSON.stringify([`creator${number}@seed.example`]),
      subscribers,
      locations[index % locations.length],
      channelName,
      new Date(Date.UTC(2024, 0, 1 + index)),
      `Synthetic seed channel profile for ${channelName}.`,
      `@${handle}`,
      `@${handle}`,
      handle,
      `@${handle}`,
      handle,
      'Synthetic seed data',
      '2021',
      String(subscribers * 18),
      now,
      null,
      now,
      null,
    ];
  });
}

function buildInsertQuery(rows) {
  const quotedColumns = columns
    .map(column => `"${column}"`)
    .join(', ');
  const values = [];
  const placeholders = rows.map(row => {
    const rowPlaceholders = row.map((value, index) => {
      values.push(value);
      return `$${values.length}`;
    });
    return `(${rowPlaceholders.join(', ')})`;
  });

  return {
    text: `INSERT INTO "youtube" (${quotedColumns}) VALUES ${placeholders.join(
      ', ',
    )}`,
    values,
  };
}

async function seedYoutube() {
  const requiredConfig = ['DB_HOST', 'DB_USER', 'DB_NAME'];
  const missingConfig = requiredConfig.filter(
    key => !process.env[key] || !process.env[key].trim(),
  );
  if (missingConfig.length > 0) {
    throw new Error(
      `Missing database configuration: ${missingConfig.join(', ')}.`,
    );
  }

  const port = Number(process.env.DB_PORT || 5432);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('DB_PORT must be a valid TCP port.');
  }

  const client = new Client({
    host: process.env.DB_HOST,
    port,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  await client.connect();
  try {
    await client.query('BEGIN');
    const channels = createSeedChannels();

    for (let start = 0; start < channels.length; start += BATCH_SIZE) {
      const batch = channels.slice(start, start + BATCH_SIZE);
      const query = buildInsertQuery(batch);
      await client.query(query.text, query.values);
      console.log(
        `Inserted ${Math.min(start + batch.length, channels.length)} of ${
          channels.length
        } channels (pending commit).`,
      );
    }

    await client.query('COMMIT');
    console.log(`Successfully seeded ${CHANNEL_COUNT} YouTube channels.`);
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    await client.end();
  }
}

seedYoutube().catch(error => {
  console.error('Failed to seed YouTube channels:', error.message);
  process.exitCode = 1;
});
