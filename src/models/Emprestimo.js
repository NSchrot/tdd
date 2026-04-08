const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Emprestimo = sequelize.define('Emprestimo', {
  livro_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  data_emprestimo: {
    type: DataTypes.DATEONLY,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  data_devolucao_prevista: {
    type: DataTypes.DATEONLY,
    allowNull: false,
  },
  data_devolucao_real: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'emprestimos',
  timestamps: true,
});

module.exports = Emprestimo;
