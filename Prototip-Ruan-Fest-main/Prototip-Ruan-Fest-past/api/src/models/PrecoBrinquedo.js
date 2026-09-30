const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class PrecoBrinquedo extends Model {}

PrecoBrinquedo.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    brinquedoId: { type: DataTypes.INTEGER, allowNull: false },
    duracaoHoras: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      validate: { min: { args: [1], msg: "duracao_horas deve ser >= 1" }, max: { args: [24], msg: "duracao_horas deve ser <= 24" } }
    },
    valor: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "valor não pode ser negativo" } }
    }
  },
  {
    sequelize,
    modelName: "PrecoBrinquedo",
    tableName: "preco_brinquedo",
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ["brinquedo_id", "duracao_horas"] }]
  }
);

module.exports = PrecoBrinquedo;
