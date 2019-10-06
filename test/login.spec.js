var shell = require('shelljs');
var request = require("supertest");
var app = require('../app');
var Sequelize = require('sequelize');
var sequelize = new Sequelize('db', 'username', 'postgres', {dialect: 'postgres'});

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

  describe('Test POST /api/v1/sessions path', () => {
    test('should return an api key', () => {
      var service = { email: 'jake@yahoo.com',
                      password: 'test' };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(200)
          expect(Object.keys(response.body).length).toBe(1)
          expect(Object.keys(response.body)).toContain('api_key')
          expect(response.body.api_key.length).toBe(32)
      })
    });

    test('should not work without email', () => {
      var service = { email: '',
                      password: 'test', };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(400)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('EmailCannotBeEmpty')
          expect(response.body.status).toBe(400)
          expect(response.body.message).toBe('Email cannot be empty.')
      })
    });

    test('should not work without password', () => {
      var service = { email: 'jake@yahoo.com',
                      password: '', };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(400)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('PasswordCannotBeEmpty')
          expect(response.body.status).toBe(400)
          expect(response.body.message).toBe('Password cannot be empty.')
      })
    });

    test('should not work with bad password', () => {
      var service = { email: 'jake@yahoo.com',
                      password: 'frog', };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(401)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('EmailOrPasswordIncorrect')
          expect(response.body.status).toBe(401)
          expect(response.body.message).toBe('Email or password is incorrect.')
      })
    });

    test('should not work with bad email', () => {
      var service = { email: 'jake@gmail.com',
                      password: 'test', };

      return request(app)
        .post('/api/v1/sessions')
        .send(service)
        .then(response => {
          expect(response.status).toBe(401)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('EmailOrPasswordIncorrect')
          expect(response.body.status).toBe(401)
          expect(response.body.message).toBe('Email or password is incorrect.')
      })
    });

  });
});
