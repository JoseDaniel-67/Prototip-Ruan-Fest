const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class Locacao extends Model {}

Locacao.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    orcamentoId: { type: DataTypes.INTEGER, allowNull: false },
    escolaId: { type: DataTypes.INTEGER, allowNull: false },
    localidadeId: { type: DataTypes.INTEGER, allowNull: false },
    deslocamentoId: { type: DataTypes.INTEGER, allowNull: true },
    dataEvento: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { notNull: { msg: "A data do evento é obrigatória" } }
    },
    turno: {
      type: DataTypes.STRING(5),
      allowNull: false,
      validate: { isIn: { args: [["MANHA", "TARDE", "NOITE"]], msg: "turno deve ser MANHA, TARDE ou NOITE" } }
    },
    horarioInicio: { type: DataTypes.TIME, allowNull: true },
    qtdAlunos: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: { notNull: { msg: "qtd_alunos é obrigatório" }, min: { args: [1], msg: "qtd_alunos deve ser > 0" } }
    },
    duracaoHoras: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 2,
      validate: { min: { args: [1], msg: "duracao_horas deve ser >= 1" }, max: { args: [24], msg: "duracao_horas deve ser <= 24" } }
    }
  },
  {
    sequelize,
    modelName: "Locacao",
    tableName: "locacao",
    underscored: true,
    timestamps: false,
    indexes: [{ unique: true, fields: ["orcamento_id", "escola_id", "data_evento", "turno"] }]
  }
);

module.exports = Locacao;
