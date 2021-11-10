import * as redis from 'redis';
import * as bluebird from 'bluebird';
import { AppConfig } from '../../app.config';

// Promisify all the functions exported by node_redis.
bluebird.promisifyAll(redis);

// Create a client and connect to Redis using configuration from env
const clientConfig:any = {
  host: AppConfig.REDIS_HOST,
  port: AppConfig.REDIS_PORT,
//   db: "1"
};

if (AppConfig.REDIS_PASSWORD && AppConfig.REDIS_PASSWORD.length > 0 && AppConfig.REDIS_PASSWORD !== null) {
  clientConfig.password = AppConfig.REDIS_PASSWORD;
}

const client = redis.createClient(clientConfig);

// This is a catch all basic error handler.
client.on('error', (error) => console.log(error));

let newRedis = {
  /**
   * Get the application's connected Redis client instance.
   *
   * @returns {Object} - a connected node_redis client instance.
   */
  getClient: () => client,
};

export default newRedis