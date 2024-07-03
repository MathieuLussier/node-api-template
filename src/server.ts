require('@configs/env.config')('development');
import logger from './utils/logger.util';
import App from './app';

const port = process.env.PORT || 3000;

const app = new App().app;

const server = app.listen(port, () => {
  logger.info(`Listening on port ${port}`);
});

export default server;
