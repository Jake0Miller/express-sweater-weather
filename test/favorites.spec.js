const shell = require('shelljs');
const request = require("supertest");
const app = require('../app');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('db', 'username', 'postgres', {dialect: 'postgres'});
const User = require('../models').User;
const Location = require('../models').Location;
const FavoriteLocation = require('../models').FavoriteLocation;

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
      .post('/api/v1/favorites')
      .send(service)
      .then(response => {
        expect(response.status).toBe(200)
        expect(Object.keys(response.body).length).toBe(1)
        expect(response.body.message).toBe('Denver, CO has been added to your favorites')
      })
    });

    test('should list favorite locations', async () => {
      let user = await User.findOne({where: {email: 'jake@yahoo.com'}})
      let denver = await Location.findOne({where: {location: 'denver,co'}})
      let fav = await FavoriteLocation.create({user_id: user.id, location_id: denver.id})

      service = {api_key: user.apiKey};

      return request(app)
      .get('/api/v1/favorites')
      .send(service)
      .then(response => {
        expect(response.status).toBe(200)
        expect(Object.keys(response.body).length).toBe(2)
        expect(Object.keys(response.body[0]).length).toBe(2)
        expect(Object.keys(response.body[0]).length).toBe(2)
        expect(Object.keys(response.body[0])).toContain('location')
        expect(Object.keys(response.body[0])).toContain('current_weather')
      })
    });

    test('should delete a favorite location', async () => {
      let user = await User.findOne({where: {email: 'jake@yahoo.com'}})
      let denver = await Location.findOne({where: {location: 'denver,co'}})
      let fav = await FavoriteLocation.create({user_id: user.id, location_id: denver.id})

      service = {location: 'denver,co', api_key: user.apiKey};

      return request(app)
      .delete('/api/v1/favorites')
      .send(service)
      .then(response => {
        expect(response.status).toBe(204)
      })

      return request(app)
      .get('/api/v1/favorites')
      .send(service)
      .then(response => {
        expect(response.status).toBe(200)
        expect(Object.keys(response.body).length).toBe(1)
        expect(Object.keys(response.body[0]).length).toBe(2)
        expect(Object.keys(response.body[0]).length).toBe(2)
        expect(Object.keys(response.body[0])).toContain('location')
        expect(Object.keys(response.body[0])).toContain('current_weather')
      })
    });

  });
});
