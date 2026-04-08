const sequelize = require('../../src/database/sequelize');

const resetDatabase = async () => {
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    await sequelize.query('TRUNCATE TABLE multas');
    await sequelize.query('TRUNCATE TABLE emprestimos');
    await sequelize.query('TRUNCATE TABLE livros');
    await sequelize.query('TRUNCATE TABLE usuarios');
    await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
};

module.exports = { resetDatabase };
