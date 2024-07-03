import TaskBase from '@src/base/task.base';
import { Cron } from '@src/decorators/task.decorator';

export default class ApiTask extends TaskBase {
  constructor() {
    super();
  }

  @Cron('0 0 * * *')
  public async run() {
    this.logger.info('[APITASK] Example task running at midnight...');
  }
}
