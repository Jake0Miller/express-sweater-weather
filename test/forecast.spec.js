var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('db', 'username', 'postgres', {dialect: 'postgres'});
var User = require('../models').User;

describe('api', () => {
  beforeAll(() => {
    sequelize.close()
    shell.exec('npx sequelize db:migrate --env test')
    shell.exec('npx sequelize db:seed:all --env test')
  });
  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all --env test')
    sequelize.close();
  });

  describe('Test GET /api/v1/forecast path', () => {
    test('should return a forecast', async () => {
      let user = await User.findOne({where: {email: 'jake@yahoo.com'}})

      service = { api_key: user.apiKey };

      return request(app)
      .get('/api/v1/forecast?location=denver,co')
      .send(service)
      .then(response => {
        expect(response.status).toBe(200)
        expect(response).toBe(200)
        expect(Object.keys(response.body).length).toBe(4)
        expect(Object.keys(response.body)).toContain('location')
        expect(Object.keys(response.body)).toContain('currently')
        expect(Object.keys(response.body)).toContain('hourly')
        expect(Object.keys(response.body)).toContain('daily')
      })
    });

    test('should not work with a bad api key', () => {
      var service = { api_key: '1234' };

      return request(app)
        .get('/api/v1/forecast?location=denver,co')
        .send(service)
        .then(response => {
          expect(response.status).toBe(401)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.message).toBe('Unauthorized.')
      })
    });

  });
});
