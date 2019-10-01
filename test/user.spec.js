var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');

describe('api', () => {
  beforeAll(() => {
    shell.exec('npx sequelize db:create')
    shell.exec('npx sequelize db:migrate')
  });
  // beforeEach(() => {
  //   shell.exec('npx sequelize db:migrate')
  //   shell.exec('npx sequelize db:seed:all')
  // });
  // afterEach(() => {
  //   shell.exec('npx sequelize db:migrate:undo:all')
  // });

  describe('Test POST /api/v1/users path', () => {
    var service = {
      title: "Mario",
      price: 500,
      releaseYear: 1985,
      active: true
    };

    test('should return an api key', () => {
      return request(app)
        .post("/api/v1/users")
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
