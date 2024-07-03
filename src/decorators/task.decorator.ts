import cron from 'node-cron';

export function Cron(schedule: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    if (!target._cronTasks) {
      target._cronTasks = [];
    }

    const originalMethod = descriptor.value;

    const valid = cron.validate(schedule);
    if (!valid) {
      throw new Error(
        `[CRON] Invalid cron schedule ${schedule} for ${propertyKey}`
      );
    }

    target._cronTasks.push({
      schedule,
      method: originalMethod,
    });

    return descriptor;
  };
}
