import { createClient } from 'redis';

export default class Redis {
  private static instance: Redis;
  protected client = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
  });

  constructor() {}

  static getInstance(): Redis {
    if (!Redis.instance) {
      Redis.instance = new Redis();
    }

    return Redis.instance;
  }
}
