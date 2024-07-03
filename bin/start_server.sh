#!/bin/sh

npx sequelize db:migrate --env production
node --trace-deprecation -r ts-node/register/transpile-only -r tsconfig-paths/register bin/node-api-template
