#!/bin/sh

# check if argument --env is passed and set variable to the value of --env else set variable to development
if [ "$1" = "--env" ]; then
  ENV=$2
else
  ENV="development"
fi

# check if the value of --env is either development or production
if [ "$ENV" != "development" ] && [ "$ENV" != "production" ]; then
  echo "Invalid environment. Please use either development or production"
  exit 1
fi

# check if the value of --env is production
if [ "$ENV" = "production" ]; then
  npx sequelize db:create --env $ENV
  npx sequelize db:migrate --env $ENV
  npx sequelize db:seed:all --env $ENV
  www
  exit 0
fi

# check if the value of --env is development
if [ "$ENV" = "development" ]; then
  npx sequelize db:create --env $ENV
  npx sequelize db:migrate --env $ENV
  npm run dev
  exit 0
fi
