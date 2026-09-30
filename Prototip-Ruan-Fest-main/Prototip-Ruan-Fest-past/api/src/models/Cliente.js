const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Cliente extends Model {}

Cliente.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(150),
      allowNull: false,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    tipo: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "PARTICULAR",
      validate: {
        isIn: { args: [["PREFEITURA", "EMPRESA", "PARTICULAR"]], msg: "tipo deve ser PREFEITURA, EMPRESA ou PARTICULAR" }
      }
    },
    documento: { type: DataTypes.STRING(18), allowNull: true, unique: true }, // CNPJ ou CPF
    telefone: { type: DataTypes.STRING(20), allowNull: true },
    email: { type: DataTypes.STRING(150), allowNull: true, validate: { isEmail: { msg: "E-mail inválido" } } }
  },
  {
    sequelize,
    modelName: "Cliente",
    tableName: "cliente",
    underscored: true,
    createdAt: "criado_em",
    updatedAt: false
  }
);

module.exports = Cliente;
