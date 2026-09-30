const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Deslocamento extends Model {}

Deslocamento.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orcamentoId: { type: DataTypes.INTEGER, allowNull: false },
    localidadeId: { type: DataTypes.INTEGER, allowNull: false },
    dataDeslocamento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notNull: { msg: "A data do deslocamento é obrigatória" } }
    },
    descricao: { type: DataTypes.STRING(200), allowNull: true },
    prestador: { type: DataTypes.STRING(100), allowNull: true },
    // NULL = "a informar" (não inventar valor); por isso não tem defaultValue nem allowNull:false.
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
      validate: { min: { args: [0], msg: "valor não pode ser negativo" } }
    }
  },
  { sequelize, modelName: "Deslocamento", tableName: "deslocamento", underscored: true, timestamps: false }
);

module.exports = Deslocamento;
