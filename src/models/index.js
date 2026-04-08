const sequelize = require('../database/sequelize');
const Livro = require('./Livro');
const Usuario = require('./Usuario');
const Emprestimo = require('./Emprestimo');
const Multa = require('./Multa');

Livro.hasMany(Emprestimo, { foreignKey: 'livro_id', as: 'emprestimos' });
Usuario.hasMany(Emprestimo, { foreignKey: 'usuario_id', as: 'emprestimos' });
Emprestimo.belongsTo(Livro, { foreignKey: 'livro_id', as: 'livro' });
Emprestimo.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

Usuario.hasMany(Multa, { foreignKey: 'usuario_id', as: 'multas' });
Emprestimo.hasMany(Multa, { foreignKey: 'emprestimo_id', as: 'multas' });
Multa.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
Multa.belongsTo(Emprestimo, { foreignKey: 'emprestimo_id', as: 'emprestimo' });

module.exports = {
  sequelize,
  Livro,
  Usuario,
  Emprestimo,
  Multa,
};
