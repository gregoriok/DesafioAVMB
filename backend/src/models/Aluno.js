const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Curso = require('./Curso');

const Aluno = sequelize.define('Aluno', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  instituicao_id: { type: DataTypes.UUID, allowNull: false },
  nome: { type: DataTypes.STRING, allowNull: false },
  cpf: { type: DataTypes.STRING, allowNull: false },
  dt_nascimento: { type: DataTypes.DATEONLY },
  hash: { type: DataTypes.STRING, unique: true },
  file_path: { type: DataTypes.STRING },
  status: { type: DataTypes.ENUM('ativo', 'cancelado'), defaultValue: 'ativo' }
}, {
  paranoid: true // Ativa o Soft Delete (deleted_at) exigido no requisito 8
});

// Relacionamento: 1 Aluno tem 1 Curso (neste contexto de importação)
Aluno.hasOne(Curso, { foreignKey: 'aluno_id', as: 'curso' });
Curso.belongsTo(Aluno, { foreignKey: 'aluno_id' });

module.exports = Aluno;