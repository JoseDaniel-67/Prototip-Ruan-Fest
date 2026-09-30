const { Model, DataTypes } = require("sequelize");
const sequelize = require("../config/database");

class ItemLocacao extends Model {}

ItemLocacao.init(
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    locacaoId: { type: DataTypes.INTEGER, allowNull: false },
    brinquedoId: { type: DataTypes.INTEGER, allowNull: true },
    servicoId: { type: DataTypes.INTEGER, allowNull: true },
    quantidade: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      defaultValue: 1,
      validate: { min: { args: [1], msg: "quantidade deve ser > 0" } }
    },
    // Preço CONGELADO no momento do orçamento: mudar preco_brinquedo/servico_extra
    // depois não deve alterar orçamentos já criados.
    valorUnitario: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: { min: { args: [0], msg: "valor_unitario não pode ser negativo" } }
    }
  },
  {
    sequelize,
    modelName: "ItemLocacao",
    tableName: "item_locacao",
    underscored: true,
    timestamps: false,
    validate: {
      // CHECK (brinquedo_id IS NULL) <> (servico_id IS NULL)  -->  exatamente um dos dois
      exatamenteUmTipo() {
        const temBrinquedo = this.brinquedoId !== null && this.brinquedoId !== undefined;
        const temServico = this.servicoId !== null && this.servicoId !== undefined;
        if (temBrinquedo === temServico) {
          throw new Error("Informe brinquedoId OU servicoId (exatamente um dos dois)");
        }
      }
    }
  }
);

module.exports = ItemLocacao;
