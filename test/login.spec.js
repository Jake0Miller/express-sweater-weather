var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('db', 'username', 'postgres', {dialect: 'postgres'});

describe('api', () => {
  beforeAll(() => {
    sequelize.close()
    shell.exec('npx sequelize db:create')
    shell.exec('npx sequelize db:migrate')
    shell.exec('npx sequelize db:seed:all')
  });
  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all')
    sequelize.close();
  });

  describe('Test POST /api/v1/sessions path', () => {
    test('should return an api key', () => {
      var service = {
        email: 'jake@yahoo.com',
        password: 'test'
      };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(201)
          expect(Object.keys(response.body).length).toBe(1)
          expect(Object.keys(response.body)).toContain('api_key')
          expect(response.body.api_key.length).toBe(32)
      })
    });
  });

});
