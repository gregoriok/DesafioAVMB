const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Curso = sequelize.define('Curso', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  codigo: { type: DataTypes.STRING, allowNull: false },
  dt_inicio: { type: DataTypes.DATEONLY, allowNull: false },
  dt_fim: { type: DataTypes.DATEONLY, allowNull: false },
  docente: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Curso;