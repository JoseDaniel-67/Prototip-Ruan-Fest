const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "ativa"];

class EscolaService {
  constructor(repository) {
    this.repository = repository;
  }

  cadastrar(dados) { return this.repository.criar(pick(dados, CAMPOS)); }
  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const escola = await this.repository.buscarPorId(id);
    if (!escola) throw new AppError(404, "Escola não encontrada");
    return escola;
  }

  async atualizar(id, dados) {
    const escola = await this.buscarPorId(id);
    return this.repository.atualizar(escola, pick(dados, CAMPOS));
  }

  async excluir(id) {
    const escola = await this.buscarPorId(id);
    await this.repository.excluir(escola);
  }
}

module.exports = EscolaService;
