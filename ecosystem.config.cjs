module.exports = {
  apps: [
    {
      name: 'app name',
      script: 'npm',
      args: 'start',
    },
  ],

  // Deployment Configuration
  deploy: {
    // production: {
    //   key: '~/.ssh/id_rsa',
    //   user: 'debian',
    //   host: ['192.99.34.69'],
    //   ref: 'origin/master',
    //   repo: 'repo.git',
    //   path: '/home/debian/appname',
    //   env: {
    //     NODE_ENV: 'production',
    //   },
    //   'post-deploy':
    //     'npm ci --production  && npx sequelize db:migrate --env production && pm2 startOrRestart ecosystem.config.cjs --env production',
    // },
  },
};
