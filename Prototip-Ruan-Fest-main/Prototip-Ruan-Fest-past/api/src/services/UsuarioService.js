const AppError = require("../utils/AppError");
const pick = require("../utils/pick");
const { hashSenha } = require("../utils/hash");

class UsuarioService {
  constructor(repository) {
    this.repository = repository;
  }

  async cadastrar(dados) {
    const campos = pick(dados, ["nome", "email", "perfil", "ativo"]);
    if (!dados.senha) throw new AppError(400, "O campo senha é obrigatório");
    campos.senhaHash = hashSenha(dados.senha);
    return this.repository.criar(campos);
  }

  listar() {
    return this.repository.buscarTodos();
  }

  async buscarPorId(id) {
    const usuario = await this.repository.buscarPorId(id);
    if (!usuario) throw new AppError(404, "Usuário não encontrado");
    return usuario;
  }

  async atualizar(id, dados) {
    const usuario = await this.buscarPorId(id);
    const campos = pick(dados, ["nome", "email", "perfil", "ativo"]);
    if (dados.senha) campos.senhaHash = hashSenha(dados.senha);
    return this.repository.atualizar(usuario, campos);
  }

  async excluir(id) {
    const usuario = await this.buscarPorId(id);
    await this.repository.excluir(usuario);
  }
}

module.exports = UsuarioService;
