const { Op } = require("sequelize");
const {
  Orcamento, Cliente, Usuario, Locacao, Escola, Localidade,
  Deslocamento, ItemLocacao, Brinquedo, ServicoExtra
} = require("../models");

const INCLUDE_LISTA = [
  { model: Cliente, attributes: ["id", "nome", "tipo"] },
  { model: Usuario, attributes: ["id", "nome"] }
];

const INCLUDE_DETALHE = [
  ...INCLUDE_LISTA,
  {
    model: Locacao,
    include: [
      { model: Escola, attributes: ["id", "nome"] },
      { model: Localidade, attributes: ["id", "nome"] },
      { model: Deslocamento, attributes: ["id", "dataDeslocamento", "valor"] },
      {
        model: ItemLocacao,
        include: [
          { model: Brinquedo, attributes: ["id", "nome"] },
          { model: ServicoExtra, attributes: ["id", "nome"] }
        ]
      }
    ]
  },
  { model: Deslocamento, include: [{ model: Localidade, attributes: ["id", "nome"] }] }
];

class OrcamentoRepository {
  criar(dados) { return Orcamento.create(dados); }
  buscarTodos() { return Orcamento.findAll({ include: INCLUDE_LISTA, order: [["id", "DESC"]] }); }
  buscarPorId(id) { return Orcamento.findByPk(id, { include: INCLUDE_DETALHE }); }
  buscarPorIdSimples(id, options = {}) { return Orcamento.findByPk(id, options); }
  atualizar(orcamento, dados) { return orcamento.update(dados); }
  excluir(orcamento) { return orcamento.destroy(); }

  contarDoAno(ano) {
    return Orcamento.count({ where: { numero: { [Op.like]: `${ano}-%` } } });
  }

  /**
   * Espelha a view vw_orcamento_totais do docs/schema.sql:
   * subtotal dos brinquedos (soma de todos os itens de todas as locações do
   * orçamento) + soma dos deslocamentos. O total NUNCA é gravado, só calculado.
   */
  async totais(orcamentoId) {
    const locacoes = await Locacao.findAll({ where: { orcamentoId }, attributes: ["id"] });
    const locacaoIds = locacoes.map((l) => l.id);

    const itens = locacaoIds.length
      ? await ItemLocacao.findAll({ where: { locacaoId: { [Op.in]: locacaoIds } } })
      : [];
    const subtotalBrinquedos = itens.reduce(
      (soma, item) => soma + item.quantidade * Number(item.valorUnitario),
      0
    );

    // Deslocamento.valor pode ser NULL ("a informar"); Sequelize.sum já ignora NULLs.
    const totalDeslocamento = Number(await Deslocamento.sum("valor", { where: { orcamentoId } })) || 0;

    return { subtotalBrinquedos, totalDeslocamento, totalGeral: subtotalBrinquedos + totalDeslocamento };
  }

  /** Espelha a view vw_total_por_escola. */
  async totalPorEscola(orcamentoId) {
    const locacoes = await Locacao.findAll({
      where: { orcamentoId },
      include: [{ model: Escola, attributes: ["id", "nome"] }]
    });
    if (locacoes.length === 0) return [];

    const itens = await ItemLocacao.findAll({
      where: { locacaoId: { [Op.in]: locacoes.map((l) => l.id) } }
    });

    // total de cada locação
    const totalPorLocacao = new Map();
    for (const item of itens) {
      const atual = totalPorLocacao.get(item.locacaoId) || 0;
      totalPorLocacao.set(item.locacaoId, atual + item.quantidade * Number(item.valorUnitario));
    }

    // soma por escola (uma escola pode ter mais de uma locação no mesmo orçamento)
    const porEscola = new Map();
    for (const locacao of locacoes) {
      const totalDaLocacao = totalPorLocacao.get(locacao.id) || 0;
      const entrada = porEscola.get(locacao.escolaId) || {
        escolaId: locacao.escolaId,
        escolaNome: locacao.Escola.nome,
        totalEscola: 0
      };
      entrada.totalEscola += totalDaLocacao;
      porEscola.set(locacao.escolaId, entrada);
    }

    return [...porEscola.values()].sort((a, b) => a.escolaNome.localeCompare(b.escolaNome));
  }
}

module.exports = OrcamentoRepository;
