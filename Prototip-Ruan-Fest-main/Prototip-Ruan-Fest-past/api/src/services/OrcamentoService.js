const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["clienteId", "usuarioId", "titulo", "dataEmissao", "status", "observacoes"];

class OrcamentoService {
  constructor(orcamentoRepository, clienteRepository, usuarioRepository) {
    this.repository = orcamentoRepository;
    this.clienteRepository = clienteRepository;
    this.usuarioRepository = usuarioRepository;
  }

  async gerarNumero(dataEmissao) {
    const ano = dataEmissao ? new Date(dataEmissao).getFullYear() : new Date().getFullYear();
    const quantidade = await this.repository.contarDoAno(ano);
    const sequencial = String(quantidade + 1).padStart(4, "0");
    return `${ano}-${sequencial}`;
  }

  async cadastrar(dados) {
    const campos = pick(dados, CAMPOS);

    if (!campos.clienteId) throw new AppError(400, "clienteId é obrigatório");
    const cliente = await this.clienteRepository.buscarPorId(campos.clienteId);
    if (!cliente) throw new AppError(400, "clienteId inválido: cliente não encontrado");

    if (campos.usuarioId) {
      const usuario = await this.usuarioRepository.buscarPorId(campos.usuarioId);
      if (!usuario) throw new AppError(400, "usuarioId inválido: usuário não encontrado");
    }

    campos.numero = await this.gerarNumero(campos.dataEmissao);
    const criado = await this.repository.criar(campos);
    return this.buscarPorId(criado.id);
  }

  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const orcamento = await this.repository.buscarPorId(id);
    if (!orcamento) throw new AppError(404, "Orçamento não encontrado");
    return orcamento;
  }

  async atualizar(id, dados) {
    await this.buscarPorId(id);
    const campos = pick(dados, CAMPOS.filter((c) => c !== "clienteId")); // não deixamos trocar o cliente do orçamento
    const orcamentoSimples = await this.repository.buscarPorIdSimples(id);
    await this.repository.atualizar(orcamentoSimples, campos);
    return this.buscarPorId(id);
  }

  async excluir(id) {
    const orcamento = await this.buscarPorId(id);
    await this.repository.excluir(orcamento); // CASCADE: remove locações, itens e deslocamentos
  }

  async totais(id) {
    await this.buscarPorId(id);
    return this.repository.totais(id);
  }

  async totalPorEscola(id) {
    await this.buscarPorId(id);
    return this.repository.totalPorEscola(id);
  }
}

module.exports = OrcamentoService;
