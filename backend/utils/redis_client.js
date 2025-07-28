const { createClient } = require("redis");

const redisClient = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379',
  socket: {
    tls: process.env.REDIS_URL?.startsWith('rediss://'),
    connectTimeout: 10000
  }
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Connected to Redis');
  } catch (err) {
    console.error('Redis connection error:', err.message);
  }
})();

redisClient.on('error', (err) => 
  console.error('Redis error:', err.message)
);

module.exports = redisClient;