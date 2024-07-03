import { Queue, Job, Worker } from 'bullmq';
import logger from '@src/utils/logger.util';

export default abstract class BaseQueue {
  private name: string;
  protected queue: Queue;
  protected worker: Worker;
  protected redisPort =
    typeof process.env.REDIS_PORT === 'undefined'
      ? 6379
      : +process.env.REDIS_PORT;
  protected redisConnectionObj = {
    connection: { host: process.env.REDIS_HOST, port: this.redisPort },
  };

  constructor(name: string) {
    this.name = name;
    this.queue = new Queue(name, this.redisConnectionObj);
    this.worker = new Worker(
      name,
      this.processJob.bind(this),
      this.redisConnectionObj
    );

    this.worker.on('completed', this.jobCompleted);
    this.worker.on('failed', this.jobFailed);
  }

  async jobCompleted(job, result) {
    logger.info(
      `[${this.name.toUpperCase()}] Job ${job.id} completed with result: ${result} for queue: ${job.queue.name}`
    );
  }

  async jobFailed(job, err) {
    console.error(err);
    logger.error(
      `[${this.name.toUpperCase()}] Job ${job.id} failed with error: ${err} for queue: ${job.queue.name}`
    );
  }

  async addJob(jobName: string, data: any, delay: number = 0) {
    await this.queue.add(jobName, data, {
      attempts: 3,
      delay,
      backoff: {
        type: 'exponential',
        delay: 60000,
      },
      removeOnComplete: {
        age: 3600, // keep up to 1 hour
        count: 1000, // keep up to 1000 jobs
      },
      removeOnFail: {
        age: 24 * 3600, // keep up to 24 hours
      },
    });
  }

  async addBulkJobs(jobs: { name: string; data: any }[]) {
    await this.queue.addBulk(jobs);
  }

  abstract processJob(job: Job): Promise<any>;

  async close() {
    await this.worker.close();
    await this.queue.close();
  }
}
