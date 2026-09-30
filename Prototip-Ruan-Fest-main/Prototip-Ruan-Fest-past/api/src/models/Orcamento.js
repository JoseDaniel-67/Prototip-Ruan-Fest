const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Orcamento extends Model {}

Orcamento.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    numero: { type: DataTypes.STRING(20), allowNull: false, unique: true }, // gerado pelo Service (ex.: 2026-0001)
    clienteId: { type: DataTypes.INTEGER, allowNull: false },
    usuarioId: { type: DataTypes.INTEGER, allowNull: true },
    titulo: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: { notNull: { msg: "O título é obrigatório" }, notEmpty: { msg: "O título não pode ser vazio" } }
    },
    dataEmissao: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
    status: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "RASCUNHO",
      validate: {
        isIn: { args: [["RASCUNHO", "ENVIADO", "APROVADO", "RECUSADO"]], msg: "status inválido" }
      }
    },
    observacoes: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    sequelize,
    modelName: "Orcamento",
    tableName: "orcamento",
    underscored: true,
    createdAt: "criado_em",
    updatedAt: false
  }
);

module.exports = Orcamento;
