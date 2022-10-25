import { Provider } from '@nestjs/common';
import Redis from 'ioredis';
import { config } from 'src/config';
import { REDIS_CLIENT } from './const';
export type RedisClient = Redis;

export const RedisProvider: Provider = {
  useFactory: (): RedisClient => {
    return new Redis({
      host: config().REDIS_HOST,
      port: config().REDIS_PORT,
      password: config().REDIS_PASSWORD,
    });
  },
  provide: REDIS_CLIENT,
};
