const shell = require('shelljs');
const request = require("supertest");
const app = require('../app');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('db', 'username', 'postgres', {dialect: 'postgres'});
const User = require('../models').User;

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

  describe('Test POST /api/v1/favorites path', () => {
    test('should create a favorite location', async () => {
      let user = await User.findOne({where: {email: 'jake@yahoo.com'}})

      service = {location: "Denver, CO", api_key: user.apiKey};

      return request(app)
      .get('/api/v1/favorites')
      .send(service)
      .then(response => {
        expect(response.status).toBe(200)
        expect(Object.keys(response.body).length).toBe(1)
        expect(response.body.message).toBe('Denver, CO has been added to your favorites')
      })
    });

  });
});
