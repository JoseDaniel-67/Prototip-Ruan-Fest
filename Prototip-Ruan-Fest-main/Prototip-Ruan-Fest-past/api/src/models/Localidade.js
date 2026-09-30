const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Localidade extends Model {}

Localidade.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    tipoEspaco: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "OUTRO",
      validate: { isIn: { args: [["QUADRA", "GINASIO", "ESCOLA", "OUTRO"]], msg: "tipo_espaco inválido" } }
    },
    exigeTransporteTerceiros: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
  },
  { sequelize, modelName: "Localidade", tableName: "localidade", underscored: true, timestamps: false }
);

module.exports = Localidade;
