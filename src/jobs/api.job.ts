import BaseQueue from '../base/queue.base';
import { Job } from 'bullmq';

import logger from '@src/utils/logger.util';

export default class ApiQueue extends BaseQueue {
  static instance: ApiQueue;

  constructor() {
    super('apiQueue');
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new ApiQueue();
    }

    return this.instance;
  }

  async processJob(job: Job) {
    switch (job.name) {
      case 'jobExample':
        return this.jobExample(job);
      default:
        logger.error(`[CRON] Job name not found: ${job.name}`);
    }
  }

  async jobExample(job: Job) {
    logger.info(`[CRON] Running job example: ${job.id}`);
    return 'ok';
  }
}
