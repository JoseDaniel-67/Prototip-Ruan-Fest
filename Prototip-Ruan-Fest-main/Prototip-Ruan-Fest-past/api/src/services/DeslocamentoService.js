const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["localidadeId", "dataDeslocamento", "descricao", "prestador", "valor"];

class DeslocamentoService {
  constructor(deslocamentoRepository, orcamentoRepository, localidadeRepository) {
    this.repository = deslocamentoRepository;
    this.orcamentoRepository = orcamentoRepository;
    this.localidadeRepository = localidadeRepository;
  }

  async garantirOrcamentoExiste(orcamentoId) {
    const orcamento = await this.orcamentoRepository.buscarPorIdSimples(orcamentoId);
    if (!orcamento) throw new AppError(404, "Orçamento não encontrado");
    return orcamento;
  }

  async cadastrar(orcamentoId, dados) {
    await this.garantirOrcamentoExiste(orcamentoId);
    const campos = pick(dados, CAMPOS);

    if (!campos.localidadeId) throw new AppError(400, "localidadeId é obrigatório");
    const localidade = await this.localidadeRepository.buscarPorId(campos.localidadeId);
    if (!localidade) throw new AppError(400, "localidadeId inválido: localidade não encontrada");

    campos.orcamentoId = orcamentoId;
    return this.repository.criar(campos);
  }

  listarDoOrcamento(orcamentoId) {
    return this.garantirOrcamentoExiste(orcamentoId).then(() => this.repository.buscarDoOrcamento(orcamentoId));
  }

  async buscarPorId(id) {
    const deslocamento = await this.repository.buscarPorId(id);
    if (!deslocamento) throw new AppError(404, "Deslocamento não encontrado");
    return deslocamento;
  }

  async atualizar(id, dados) {
    const deslocamento = await this.buscarPorId(id);
    const campos = pick(dados, CAMPOS);
    if (campos.localidadeId) {
      const localidade = await this.localidadeRepository.buscarPorId(campos.localidadeId);
      if (!localidade) throw new AppError(400, "localidadeId inválido: localidade não encontrada");
    }
    return this.repository.atualizar(deslocamento, campos);
  }

  async excluir(id) {
    const deslocamento = await this.buscarPorId(id);
    // As locações que apontavam para este deslocamento voltam a ter deslocamentoId = NULL (SET NULL)
    await this.repository.excluir(deslocamento);
  }
}

module.exports = DeslocamentoService;
