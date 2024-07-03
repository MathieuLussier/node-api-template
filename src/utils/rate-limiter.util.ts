import { AxiosInstance } from 'axios';

import logger from './logger.util';

interface IRateLimiter {
  handle(...args: any): any;
}

abstract class RateLimiter implements IRateLimiter {
  abstract delay: number;

  sleep(ms: number) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
  }

  abstract handle(...args: any): any;
}

export class ApiRateLimiter extends RateLimiter {
  delay = 5000;

  public async handle(client: AxiosInstance, options: any = {}) {
    try {
      const res = await client.request(options);
      return res;
    } catch (error: any) {
      if (error.response && error.response.status === 429) {
        logger.info(`[API] Rate limit exceeded, waiting for ${this.delay}ms`);
        await this.sleep(this.delay);
        return this.handle(client, options);
      }

      logger.error(`[RATELIMIT] Error while handling request: ${error}`);
    }
  }
}
