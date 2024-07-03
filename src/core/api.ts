import BaseCore from '@src/base/core.base';

import logger from '@src/utils/logger.util';

export default class Api extends BaseCore {
  constructor() {
    super();

    logger.info('[API] Initialized');
  }
}
