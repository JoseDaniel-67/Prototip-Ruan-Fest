const { Usuario } = require("../models");

class UsuarioRepository {
  criar(dados) { return Usuario.create(dados); }
  buscarTodos() { return Usuario.findAll({ order: [["nome", "ASC"]] }); }
  buscarPorId(id) { return Usuario.findByPk(id); }
  buscarPorEmail(email) { return Usuario.findOne({ where: { email } }); }
  atualizar(usuario, dados) { return usuario.update(dados); }
  excluir(usuario) { return usuario.destroy(); }
}

module.exports = UsuarioRepository;
