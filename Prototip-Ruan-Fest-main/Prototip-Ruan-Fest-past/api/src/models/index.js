const sequelize = require("../config/database");

const Usuario = require("./Usuario");
const Cliente = require("./Cliente");
const Escola = require("./Escola");
const Localidade = require("./Localidade");
const Brinquedo = require("./Brinquedo");
const PrecoBrinquedo = require("./PrecoBrinquedo");
const ServicoExtra = require("./ServicoExtra");
const Orcamento = require("./Orcamento");
const Deslocamento = require("./Deslocamento");
const Locacao = require("./Locacao");
const ItemLocacao = require("./ItemLocacao");

/* ---------- Cliente 1 ── N Orçamento ---------- */
Cliente.hasMany(Orcamento, { foreignKey: "clienteId", onDelete: "RESTRICT" });
Orcamento.belongsTo(Cliente, { foreignKey: "clienteId" });

/* ---------- Usuário 0..1 ── N Orçamento (quem elaborou) ---------- */
Usuario.hasMany(Orcamento, { foreignKey: "usuarioId", onDelete: "SET NULL" });
Orcamento.belongsTo(Usuario, { foreignKey: "usuarioId" });

/* ---------- Orçamento 1 ── N Locação / Deslocamento ---------- */
Orcamento.hasMany(Locacao, { foreignKey: "orcamentoId", onDelete: "CASCADE" });
Locacao.belongsTo(Orcamento, { foreignKey: "orcamentoId" });

Orcamento.hasMany(Deslocamento, { foreignKey: "orcamentoId", onDelete: "CASCADE" });
Deslocamento.belongsTo(Orcamento, { foreignKey: "orcamentoId" });

/* ---------- Escola / Localidade 1 ── N Locação ---------- */
Escola.hasMany(Locacao, { foreignKey: "escolaId", onDelete: "RESTRICT" });
Locacao.belongsTo(Escola, { foreignKey: "escolaId" });

Localidade.hasMany(Locacao, { foreignKey: "localidadeId", onDelete: "RESTRICT" });
Locacao.belongsTo(Localidade, { foreignKey: "localidadeId" });

/* ---------- Localidade 1 ── N Deslocamento (destino) ---------- */
Localidade.hasMany(Deslocamento, { foreignKey: "localidadeId", onDelete: "RESTRICT" });
Deslocamento.belongsTo(Localidade, { foreignKey: "localidadeId" });

/* ---------- Deslocamento 0..1 ── N Locação (uma viagem atende várias locações) ---------- */
Deslocamento.hasMany(Locacao, { foreignKey: "deslocamentoId", onDelete: "SET NULL" });
Locacao.belongsTo(Deslocamento, { foreignKey: "deslocamentoId" });

/* ---------- Locação 1 ── N Item de locação ---------- */
Locacao.hasMany(ItemLocacao, { foreignKey: "locacaoId", onDelete: "CASCADE" });
ItemLocacao.belongsTo(Locacao, { foreignKey: "locacaoId" });

/* ---------- Brinquedo / Serviço extra 0..1 ── N Item de locação ---------- */
Brinquedo.hasMany(ItemLocacao, { foreignKey: "brinquedoId", onDelete: "RESTRICT" });
ItemLocacao.belongsTo(Brinquedo, { foreignKey: "brinquedoId" });

ServicoExtra.hasMany(ItemLocacao, { foreignKey: "servicoId", onDelete: "RESTRICT" });
ItemLocacao.belongsTo(ServicoExtra, { foreignKey: "servicoId" });

/* ---------- Brinquedo 1 ── N Preço por duração ---------- */
Brinquedo.hasMany(PrecoBrinquedo, { foreignKey: "brinquedoId", onDelete: "CASCADE" });
PrecoBrinquedo.belongsTo(Brinquedo, { foreignKey: "brinquedoId" });

module.exports = {
  sequelize,
  Usuario,
  Cliente,
  Escola,
  Localidade,
  Brinquedo,
  PrecoBrinquedo,
  ServicoExtra,
  Orcamento,
  Deslocamento,
  Locacao,
  ItemLocacao
};
