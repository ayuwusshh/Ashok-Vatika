const { createClient } = require('redis');

let redisClient = null;

const connectRedis = async () => {
  const redisUrl = process.env.REDIS_URL || (process.env.NODE_ENV === 'production' ? null : 'redis://localhost:6379');

  if (!redisUrl) {
    console.log('Redis URL not configured; cache disabled');
    return null;
  }

  const client = createClient({ url: redisUrl });

  client.on('error', (err) => console.log('Redis Client Error', err.message));
  client.on('connect', () => console.log('Redis Connected'));

  try {
    await client.connect();
    redisClient = client;
    return redisClient;
  } catch (error) {
    console.log('Redis connection failed; cache disabled:', error.message);
    redisClient = null;
    return null;
  }
};

const getRedisClient = () => {
  return redisClient;
};

module.exports = { connectRedis, getRedisClient };
