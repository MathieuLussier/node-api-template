import EventEmitter from 'events';

export enum ApiEvents {
  EVENT_NAME = 'event_name',
}

export default class ApiEvent extends EventEmitter {
  private static instance: ApiEvent;

  constructor() {
    super();
  }

  public static getInstance() {
    if (!ApiEvent.instance) {
      ApiEvent.instance = new ApiEvent();
    }

    return ApiEvent.instance;
  }

  public subscribe(eventName: ApiEvents, callback: (_data: any) => void) {
    this.on(eventName, callback);
  }
}
