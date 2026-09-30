const { sequelize, Brinquedo, ServicoExtra } = require("../models");
const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["escolaId", "localidadeId", "deslocamentoId", "dataEvento", "turno", "horarioInicio", "qtdAlunos", "duracaoHoras"];


const BRINQUEDOS_PADRAO = ["Pula-pula pequeno", "Pula-pula grande", "Multi Park", "Tobogã"];
const SERVICOS_PADRAO = ["Pipoca", "Algodão doce"];

class LocacaoService {
  constructor(locacaoRepository, orcamentoRepository, escolaRepository, localidadeRepository, deslocamentoRepository, brinquedoRepository, itemLocacaoRepository) {
    this.repository = locacaoRepository;
    this.orcamentoRepository = orcamentoRepository;
    this.escolaRepository = escolaRepository;
    this.localidadeRepository = localidadeRepository;
    this.deslocamentoRepository = deslocamentoRepository;
    this.brinquedoRepository = brinquedoRepository;
    this.itemLocacaoRepository = itemLocacaoRepository;
  }

  async validarReferencias(orcamentoId, campos) {
    const orcamento = await this.orcamentoRepository.buscarPorIdSimples(orcamentoId);
    if (!orcamento) throw new AppError(404, "Orçamento não encontrado");

    if (campos.escolaId !== undefined) {
      const escola = await this.escolaRepository.buscarPorId(campos.escolaId);
      if (!escola) throw new AppError(400, "escolaId inválido: escola não encontrada");
    }
    if (campos.localidadeId !== undefined) {
      const localidade = await this.localidadeRepository.buscarPorId(campos.localidadeId);
      if (!localidade) throw new AppError(400, "localidadeId inválido: localidade não encontrada");
    }
    if (campos.deslocamentoId !== undefined && campos.deslocamentoId !== null) {
      const deslocamento = await this.deslocamentoRepository.buscarPorId(campos.deslocamentoId);
      if (!deslocamento) throw new AppError(400, "deslocamentoId inválido: deslocamento não encontrado");
      if (deslocamento.orcamentoId !== orcamentoId) {
        throw new AppError(400, "Esse deslocamento pertence a outro orçamento");
      }
    }
  }

  
  async montarItensPadrao(duracaoHoras, transaction) {
    const linhas = [];

    for (const nome of BRINQUEDOS_PADRAO) {
      const brinquedo = await Brinquedo.findOne({ where: { nome }, transaction });
      if (!brinquedo) throw new AppError(409, `Catálogo incompleto: brinquedo "${nome}" não está cadastrado`);

      const preco = await this.brinquedoRepository.buscarPreco(brinquedo.id, duracaoHoras, { transaction });
      if (!preco) throw new AppError(409, `Não há preço cadastrado para "${nome}" na duração de ${duracaoHoras}h`);

      linhas.push({ brinquedoId: brinquedo.id, quantidade: 1, valorUnitario: preco.valor });
    }

    for (const nome of SERVICOS_PADRAO) {
      const servico = await ServicoExtra.findOne({ where: { nome }, transaction });
      if (!servico) throw new AppError(409, `Catálogo incompleto: serviço "${nome}" não está cadastrado`);
      linhas.push({ servicoId: servico.id, quantidade: 1, valorUnitario: servico.valor });
    }

    return linhas;
  }

  async cadastrar(orcamentoId, dados) {
    const campos = pick(dados, CAMPOS);
    await this.validarReferencias(orcamentoId, campos);

    return sequelize.transaction(async (transaction) => {
      let locacao;
      try {
        locacao = await this.repository.criar({ ...campos, orcamentoId }, { transaction });
      } catch (erro) {
        if (erro.name === "SequelizeUniqueConstraintError") {
          throw new AppError(409, "Já existe uma locação para esta escola, nesta data e turno, neste orçamento");
        }
        throw erro;
      }

      const itensPadrao = await this.montarItensPadrao(locacao.duracaoHoras, transaction);
      await this.itemLocacaoRepository.criarVarios(
        itensPadrao.map((item) => ({ ...item, locacaoId: locacao.id })),
        { transaction }
      );

      return locacao.id;
    }).then((id) => this.buscarPorId(id));
  }

  listarDoOrcamento(orcamentoId) {
    return this.orcamentoRepository.buscarPorIdSimples(orcamentoId).then((orcamento) => {
      if (!orcamento) throw new AppError(404, "Orçamento não encontrado");
      return this.repository.buscarDoOrcamento(orcamentoId);
    });
  }

  async buscarPorId(id) {
    const locacao = await this.repository.buscarPorId(id);
    if (!locacao) throw new AppError(404, "Locação não encontrada");
    return locacao;
  }


  async atualizar(id, dados) {
    const locacao = await this.buscarPorId(id);
    const campos = pick(dados, CAMPOS);
    await this.validarReferencias(locacao.orcamentoId, campos);

    try {
      await this.repository.atualizar(locacao, campos);
    } catch (erro) {
      if (erro.name === "SequelizeUniqueConstraintError") {
        throw new AppError(409, "Já existe uma locação para esta escola, nesta data e turno, neste orçamento");
      }
      throw erro;
    }
    return this.buscarPorId(id);
  }

  async excluir(id) {
    const locacao = await this.buscarPorId(id);
    await this.repository.excluir(locacao); // CASCADE: remove os itens da locação
  }
}

module.exports = LocacaoService;
