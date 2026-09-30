const { Escola } = require("../models");

class EscolaRepository {
  criar(dados) { return Escola.create(dados); }
  buscarTodos() { return Escola.findAll({ order: [["nome", "ASC"]] }); }
  buscarPorId(id) { return Escola.findByPk(id); }
  atualizar(escola, dados) { return escola.update(dados); }
  excluir(escola) { return escola.destroy(); }
}

module.exports = EscolaRepository;
