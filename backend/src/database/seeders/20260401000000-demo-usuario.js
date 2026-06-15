'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('usuarios', [{
      id: 1,
      nome: 'Admin Seed',
      email: 'admin_seed_' + Date.now() + '@email.com',
      senha: '123',
      tipo: 'admin',
      createdAt: new Date(),
      updatedAt: new Date()
    }], { ignoreDuplicates: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('usuarios', { id: 1 }, {});
  }
};
