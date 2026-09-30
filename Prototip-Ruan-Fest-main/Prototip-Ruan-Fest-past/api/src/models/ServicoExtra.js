const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class ServicoExtra extends Model {}

ServicoExtra.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(80),
      allowNull: false,
      unique: true,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    descricao: { type: DataTypes.STRING(255), allowNull: true },
    quantidadeOuTempo: { type: DataTypes.STRING(50), allowNull: true },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "valor não pode ser negativo" } }
    },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  { sequelize, modelName: "ServicoExtra", tableName: "servico_extra", underscored: true, timestamps: false }
);

module.exports = ServicoExtra;
