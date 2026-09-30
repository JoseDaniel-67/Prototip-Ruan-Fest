const { Locacao, Escola, Localidade, Deslocamento, ItemLocacao, Brinquedo, ServicoExtra } = require("../models");

const INCLUDE_PADRAO = [
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
];

class LocacaoRepository {
  criar(dados, options = {}) { return Locacao.create(dados, options); }
  buscarPorId(id, options = {}) { return Locacao.findByPk(id, { include: INCLUDE_PADRAO, ...options }); }
  buscarPorIdSimples(id, options = {}) { return Locacao.findByPk(id, options); }
  buscarDoOrcamento(orcamentoId) { return Locacao.findAll({ where: { orcamentoId }, include: INCLUDE_PADRAO }); }
  atualizar(locacao, dados) { return locacao.update(dados); }
  excluir(locacao) { return locacao.destroy(); }
}

module.exports = LocacaoRepository;
