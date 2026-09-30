const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "tipoEspaco", "exigeTransporteTerceiros"];

class LocalidadeService {
  constructor(repository) {
    this.repository = repository;
  }

  cadastrar(dados) { return this.repository.criar(pick(dados, CAMPOS)); }
  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const localidade = await this.repository.buscarPorId(id);
    if (!localidade) throw new AppError(404, "Localidade não encontrada");
    return localidade;
  }

  async atualizar(id, dados) {
    const localidade = await this.buscarPorId(id);
    return this.repository.atualizar(localidade, pick(dados, CAMPOS));
  }

  async excluir(id) {
    const localidade = await this.buscarPorId(id);
    await this.repository.excluir(localidade);
  }
}

module.exports = LocalidadeService;
