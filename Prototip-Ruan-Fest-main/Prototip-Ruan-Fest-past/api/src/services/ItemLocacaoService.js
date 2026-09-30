const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["brinquedoId", "servicoId", "quantidade", "valorUnitario"];


class ItemLocacaoService {
  constructor(itemLocacaoRepository, locacaoRepository, brinquedoRepository, servicoExtraRepository) {
    this.repository = itemLocacaoRepository;
    this.locacaoRepository = locacaoRepository;
    this.brinquedoRepository = brinquedoRepository;
    this.servicoExtraRepository = servicoExtraRepository;
  }

  async adicionar(locacaoId, dados) {
    const locacao = await this.locacaoRepository.buscarPorIdSimples(locacaoId);
    if (!locacao) throw new AppError(404, "Locação não encontrada");

    const campos = pick(dados, CAMPOS);
    const temBrinquedo = campos.brinquedoId !== undefined && campos.brinquedoId !== null;
    const temServico = campos.servicoId !== undefined && campos.servicoId !== null;

    if (temBrinquedo === temServico) {
      throw new AppError(400, "Informe brinquedoId OU servicoId (exatamente um dos dois)");
    }

    if (temBrinquedo) {
      const brinquedo = await this.brinquedoRepository.buscarPorId(campos.brinquedoId);
      if (!brinquedo) throw new AppError(400, "brinquedoId inválido: brinquedo não encontrado");
      if (campos.valorUnitario === undefined) {
        const preco = await this.brinquedoRepository.buscarPreco(campos.brinquedoId, locacao.duracaoHoras);
        if (!preco) {
          throw new AppError(409, `Não há preço cadastrado para este brinquedo na duração de ${locacao.duracaoHoras}h; informe valorUnitario manualmente`);
        }
        campos.valorUnitario = preco.valor;
      }
    } else {
      const servico = await this.servicoExtraRepository.buscarPorId(campos.servicoId);
      if (!servico) throw new AppError(400, "servicoId inválido: serviço não encontrado");
      if (campos.valorUnitario === undefined) campos.valorUnitario = servico.valor;
    }

    campos.locacaoId = locacaoId;
    campos.quantidade = campos.quantidade || 1;
    const item = await this.repository.criar(campos);
    return this.repository.buscarPorId(item.id);
  }

  async atualizar(id, dados) {
    const item = await this.buscarPorId(id);
    const campos = pick(dados, ["quantidade", "valorUnitario"]); // não trocamos o tipo do item depois de criado
    return this.repository.atualizar(item, campos);
  }

  async buscarPorId(id) {
    const item = await this.repository.buscarPorId(id);
    if (!item) throw new AppError(404, "Item de locação não encontrado");
    return item;
  }

  async excluir(id) {
    const item = await this.buscarPorId(id);
    await this.repository.excluir(item);
  }
}

module.exports = ItemLocacaoService;
