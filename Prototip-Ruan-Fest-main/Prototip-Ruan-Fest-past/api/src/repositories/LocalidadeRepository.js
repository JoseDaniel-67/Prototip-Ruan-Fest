const { Localidade } = require("../models");

class LocalidadeRepository {
  criar(dados) { return Localidade.create(dados); }
  buscarTodos() { return Localidade.findAll({ order: [["nome", "ASC"]] }); }
  buscarPorId(id) { return Localidade.findByPk(id); }
  atualizar(localidade, dados) { return localidade.update(dados); }
  excluir(localidade) { return localidade.destroy(); }
}

module.exports = LocalidadeRepository;
