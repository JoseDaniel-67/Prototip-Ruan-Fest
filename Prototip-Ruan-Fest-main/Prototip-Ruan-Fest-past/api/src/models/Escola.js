const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Escola extends Model {}

Escola.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    ativa: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, modelName: "Escola", tableName: "escola", underscored: true, timestamps: false }
);

module.exports = Escola;
