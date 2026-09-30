const { Cliente } = require("../models");

class ClienteRepository {
  criar(dados) { return Cliente.create(dados); }
  buscarTodos() { return Cliente.findAll({ order: [["nome", "ASC"]] }); }
  buscarPorId(id) { return Cliente.findByPk(id); }
  atualizar(cliente, dados) { return cliente.update(dados); }
  excluir(cliente) { return cliente.destroy(); }
}

module.exports = ClienteRepository;
