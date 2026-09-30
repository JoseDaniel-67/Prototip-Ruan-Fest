const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Brinquedo extends Model {}

Brinquedo.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    descricao: { type: DataTypes.STRING(255), allowNull: true },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, modelName: "Brinquedo", tableName: "brinquedo", underscored: true, timestamps: false }
);

module.exports = Brinquedo;
