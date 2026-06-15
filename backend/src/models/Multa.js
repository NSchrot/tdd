const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize');

const Multa = sequelize.define('Multa', {
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  emprestimo_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  valor: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  motivo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  paga: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  data_pagamento: {
    type: DataTypes.DATEONLY,
    allowNull: true,
  },
}, {
  tableName: 'multas',
  timestamps: true,
});

module.exports = Multa;
