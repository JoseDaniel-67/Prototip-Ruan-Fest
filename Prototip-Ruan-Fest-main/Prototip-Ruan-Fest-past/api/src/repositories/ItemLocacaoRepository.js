const { ItemLocacao, Brinquedo, ServicoExtra } = require("../models");

const INCLUDE_PADRAO = [
  { model: Brinquedo, attributes: ["id", "nome"] },
  { model: ServicoExtra, attributes: ["id", "nome"] }
];

class ItemLocacaoRepository {
  criar(dados, options = {}) { return ItemLocacao.create(dados, options); }
  criarVarios(linhas, options = {}) { return ItemLocacao.bulkCreate(linhas, { validate: true, ...options }); }
  buscarPorId(id, options = {}) { return ItemLocacao.findByPk(id, { include: INCLUDE_PADRAO, ...options }); }
  buscarDaLocacao(locacaoId) { return ItemLocacao.findAll({ where: { locacaoId }, include: INCLUDE_PADRAO }); }
  atualizar(item, dados) { return item.update(dados); }
  excluir(item) { return item.destroy(); }
}

module.exports = ItemLocacaoRepository;
