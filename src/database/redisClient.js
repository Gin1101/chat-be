import Redis from 'ioredis';
import util from 'util';

const redisClient = new Redis(process.env.REDIS_URL_CONNECT);

redisClient.on('error', (err) => {
  console.error('connect to redis error', err);
});

redisClient.config("SET", "notify-keyspace-events", "Ex");

redisClient.hget = util.promisify(redisClient.hget);

async function scanRedisKey(pattern) {
  let matchingKeysCount = 0;
  let keys = [];

  const recursiveScan = async (cursor = '0') => {
      const [newCursor, matchingKeys] = await redisClient.scan(cursor, 'MATCH', pattern);
      cursor = newCursor;

      matchingKeysCount += matchingKeys.length;
      keys = keys.concat(matchingKeys);

      if (cursor === '0') {
          return keys;
      } else {
          return await recursiveScan(cursor);
      }
  };

  return await recursiveScan();
}

async function cleanUserOnline() {
  const usersOnlineKey = await scanRedisKey('users_online:*');
  for (const key of usersOnlineKey) {
    await redisClient.del(key);
  }
}


cleanUserOnline();
export { scanRedisKey };
export default redisClient;