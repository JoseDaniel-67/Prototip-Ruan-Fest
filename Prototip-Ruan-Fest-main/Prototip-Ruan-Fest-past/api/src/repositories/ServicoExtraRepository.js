const { ServicoExtra } = require("../models");

class ServicoExtraRepository {
  criar(dados) { return ServicoExtra.create(dados); }
  buscarTodos() { return ServicoExtra.findAll({ order: [["nome", "ASC"]] }); }
  buscarPorId(id, options = {}) { return ServicoExtra.findByPk(id, options); }
  atualizar(servico, dados) { return servico.update(dados); }
  excluir(servico) { return servico.destroy(); }
}

module.exports = ServicoExtraRepository;
