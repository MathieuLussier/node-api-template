require('@configs/env.config')('test');
import supertest from 'supertest';
import App from '@src/app';
import { Server } from 'http';
import Database from '@src/database';

let app;

let server: Server;
let response: supertest.Response;
const dbConnection = new Database().sequelize;

describe('GET /v1 should return message that contain "Node api" in json format', () => {
  beforeAll((done) => {
    app = new App().app;
    const opening = Promise.all([
      app.listen(3001),
      dbConnection.authenticate(),
    ]);

    opening.then((values) => {
      server = values[0];
      supertest(server)
        .get('/v1')
        .then((res) => {
          response = res;
          done();
        });
    });
  });

  afterAll((done) => {
    const closing = Promise.all([server.close(), dbConnection.close()]);
    closing.then(() => done());
  });

  it('should return status code 200', (done) => {
    expect(response.status).toBe(200);
    done();
  });

  it('should return json format', (done) => {
    expect(response.type).toBe('application/json');
    done();
  });

  it('should return object with message property', (done) => {
    expect(response.body).toHaveProperty('message');
    done();
  });

  it('should return object with message property to contain "Node api"', (done) => {
    expect(response.body.message).toContain('Node api');
    done();
  });
});
