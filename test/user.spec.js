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

  describe('Test POST /api/v1/users path', () => {
    test('should return an api key', () => {
      var service = { email: 'jake@gmail.com',
                      password: 'frogs',
                      password_confirmation: 'frogs' };

      return request(app)
        .post('/api/v1/users')
        .send(service)
        .then(response => {
          expect(response.status).toBe(201)
          expect(Object.keys(response.body)).toContain('api_key')
          expect(Object.keys(response.body).length).toBe(1)
          expect(response.body.api_key.length).toBe(32)
      })
    });

    test('email must be unique', () => {
      var service = { email: 'jake@yahoo.com',
                      password: 'frogs',
                      passwordConfirmation: 'frogs' };

      return request(app)
       .post('/api/v1/users')
       .send(service)
       .then(response => {
         expect(response.status).toBe(400)
         expect(Object.keys(response.body).length).toBe(3)
         expect(Object.keys(response.body)).toContain('error')
         expect(Object.keys(response.body)).toContain('status')
         expect(Object.keys(response.body)).toContain('message')
         expect(response.body.error).toBe('EmailAlreadyTaken')
         expect(response.body.status).toBe(400)
         expect(response.body.message).toBe('Email has already been taken.')
      })
    });

    test('should not work without email', () => {
      var service = { email: '',
                      password: 'frogs',
                      passwordConfirmation: 'frogs' };

      return request(app)
        .post('/api/v1/users')
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
      var service = { email: 'jake@gmail.com',
                      password: '',
                      passwordConfirmation: 'frogs' };

      return request(app)
        .post('/api/v1/users')
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

    test('should not work without password confirmation', () => {
      var service = { email: 'jake@gmail.com',
                      password: 'frogs',
                      passwordConfirmation: '' };

      return request(app)
        .post('/api/v1/users')
        .send(service)
        .then(response => {
          expect(response.status).toBe(400)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('PasswordConfirmationCannotBeEmpty')
          expect(response.body.status).toBe(400)
          expect(response.body.message).toBe('Password confirmation cannot be empty.')
      })
    });

    test('passwords must match', () => {
      var service = { email: 'jake@gmail.com',
                      password: 'frogs',
                      passwordConfirmation: 'frog' };

      return request(app)
        .post('/api/v1/users')
        .send(service)
        .then(response => {
          expect(response.status).toBe(400)
          expect(Object.keys(response.body).length).toBe(3)
          expect(Object.keys(response.body)).toContain('error')
          expect(Object.keys(response.body)).toContain('status')
          expect(Object.keys(response.body)).toContain('message')
          expect(response.body.error).toBe('PasswordsMustMatch')
          expect(response.body.status).toBe(400)
          expect(response.body.message).toBe('Password and confirmation must match.')
      })
    });

  });
});
