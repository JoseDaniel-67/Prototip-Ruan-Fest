const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Usuario extends Model {}

Usuario.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nome: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: { notNull: { msg: "O nome é obrigatório" }, notEmpty: { msg: "O nome não pode ser vazio" } }
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      unique: true,
      validate: { notNull: { msg: "O e-mail é obrigatório" }, isEmail: { msg: "E-mail inválido" } }
    },
   
    senhaHash: { type: DataTypes.STRING(255), allowNull: false, field: "senha_hash" },
    perfil: {
      type: DataTypes.STRING(10),
      allowNull: false,
      defaultValue: "OPERADOR",
      validate: { isIn: { args: [["ADMIN", "OPERADOR"]], msg: "O perfil deve ser ADMIN ou OPERADOR" } }
    },
    ativo: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true }
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuario",
    underscored: true,
    createdAt: "criado_em",
    updatedAt: false
  }
);

module.exports = Usuario;
