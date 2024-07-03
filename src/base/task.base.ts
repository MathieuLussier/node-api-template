import logger from '@utils/logger.util';
import { Transaction } from 'sequelize';

type TaskMethod = () => void;

export default abstract class TaskBase {
  protected logger = logger;
  private _cronTasks: { schedule: string; method: TaskMethod }[];

  constructor() {
    this._cronTasks ||= [];
  }

  get cronTasks() {
    return this._cronTasks;
  }
}

interface ITaskHandler {
  setNext(task: TaskHandler): TaskHandler;
  run(t: Transaction): void;
}

export abstract class TaskHandler implements ITaskHandler {
  protected logger = logger;
  private nextTask?: TaskHandler;

  constructor() {}

  public setNext(task: TaskHandler): TaskHandler {
    this.nextTask = task;

    return task;
  }

  public async run(t): Promise<void> {
    if (this.nextTask) {
      return this.nextTask.run(t);
    }

    return;
  }
}
