const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "tipo", "documento", "telefone", "email"];

class ClienteService {
  constructor(repository) {
    this.repository = repository;
  }

  cadastrar(dados) { return this.repository.criar(pick(dados, CAMPOS)); }
  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const cliente = await this.repository.buscarPorId(id);
    if (!cliente) throw new AppError(404, "Cliente não encontrado");
    return cliente;
  }

  async atualizar(id, dados) {
    const cliente = await this.buscarPorId(id);
    return this.repository.atualizar(cliente, pick(dados, CAMPOS));
  }

  async excluir(id) {
    const cliente = await this.buscarPorId(id);
    await this.repository.excluir(cliente); // RESTRICT: bloqueado se houver orçamentos
  }
}

module.exports = ClienteService;
