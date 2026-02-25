// src/models/Instituicao.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Instituicao = sequelize.define('Instituicao', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  senha_hash: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Instituicao;