var shell = require('shelljs');
var request = require("supertest");
var index = require('../routes/index');

describe('Test the root path', () => {
  test('It should respond to the GET method', () => {
    return request(index).get("/").then(response => {
      expect(response.statusCode).toBe(200)
    })
  });
});

describe('Test user creation', () => {
  test('It should respond to the POST method', () => {
    return request(index).get("/api/v1/users").then(response => {
      expect(response.statusCode).toBe(200)
    })
  });
});
