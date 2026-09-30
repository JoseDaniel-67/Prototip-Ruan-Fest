const { Deslocamento, Localidade } = require("../models");

class DeslocamentoRepository {
  criar(dados, options = {}) { return Deslocamento.create(dados, options); }
  buscarPorId(id, options = {}) {
    return Deslocamento.findByPk(id, { include: [{ model: Localidade, attributes: ["id", "nome"] }], ...options });
  }
  buscarDoOrcamento(orcamentoId) {
    return Deslocamento.findAll({ where: { orcamentoId }, include: [{ model: Localidade, attributes: ["id", "nome"] }] });
  }
  atualizar(deslocamento, dados) { return deslocamento.update(dados); }
  excluir(deslocamento) { return deslocamento.destroy(); }
}

module.exports = DeslocamentoRepository;
