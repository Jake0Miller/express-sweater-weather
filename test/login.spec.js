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
  });
  afterAll(() => {
    shell.exec('npx sequelize db:migrate:undo:all')
    sequelize.close();
  });

  describe('Test POST /api/v1/sessions path', () => {
    
  });

});
