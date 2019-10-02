'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert('Users', [{
      email: 'jake@yahoo.com',
      password: 'test',
      api_key: 'test',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Users', null, {})
  }
};
