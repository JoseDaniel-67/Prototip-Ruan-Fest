const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "descricao", "quantidadeOuTempo", "valor", "ativo"];

class ServicoExtraService {
  constructor(repository) {
    this.repository = repository;
  }

  cadastrar(dados) { return this.repository.criar(pick(dados, CAMPOS)); }
  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const servico = await this.repository.buscarPorId(id);
    if (!servico) throw new AppError(404, "Serviço extra não encontrado");
    return servico;
  }

  async atualizar(id, dados) {
    const servico = await this.buscarPorId(id);
    return this.repository.atualizar(servico, pick(dados, CAMPOS));
  }

  async excluir(id) {
    const servico = await this.buscarPorId(id);
    await this.repository.excluir(servico);
  }
}

module.exports = ServicoExtraService;
