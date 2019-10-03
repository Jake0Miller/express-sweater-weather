'use strict';
const bcrypt = require('bcrypt');
var srs = require('secure-random-string');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'jake@yahoo.com',
      password: bcrypt.hashSync('test', 10),
      apiKey: srs(),
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
