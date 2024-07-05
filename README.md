# node-api-template

node-api-template is a micro service api template.

## Installation

Todo

## Todo

Application:
- [ ] Create an error handler wrapper for all the routes.
- [x] Create docker file and docker-compose file.
- [ ] Create tests using samples data
- [ ] Create seed data

Caching:
- [ ] Create a base interface for caching
- [ ] Create logics to invalidate cached data

Authentication:
- [x] Implement users authentication, registration, login.
- [x] Implement api key functionality for the users.
- [ ] Implement a role based access control for the users.
  - [ ] Secure all the content and action based on roles.
  - [ ] Secure all the important routes with a middleware based on roles.
