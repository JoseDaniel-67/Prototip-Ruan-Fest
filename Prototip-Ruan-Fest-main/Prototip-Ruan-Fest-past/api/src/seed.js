const { sequelize, Brinquedo, PrecoBrinquedo, ServicoExtra, Localidade, Escola, Cliente } = require("./models");

const ClienteRepository = require("./repositories/ClienteRepository");
const EscolaRepository = require("./repositories/EscolaRepository");
const LocalidadeRepository = require("./repositories/LocalidadeRepository");
const OrcamentoRepository = require("./repositories/OrcamentoRepository");
const DeslocamentoRepository = require("./repositories/DeslocamentoRepository");
const LocacaoRepository = require("./repositories/LocacaoRepository");
const BrinquedoRepository = require("./repositories/BrinquedoRepository");
const ItemLocacaoRepository = require("./repositories/ItemLocacaoRepository");
const UsuarioRepository = require("./repositories/UsuarioRepository");

const OrcamentoService = require("./services/OrcamentoService");
const DeslocamentoService = require("./services/DeslocamentoService");
const LocacaoService = require("./services/LocacaoService");

async function seedCatalogo() {
  const precosPorBrinquedo = {
    "Pula-pula pequeno": { descricao: "Pula-pula 2,44 m", precos: { 1: 80, 2: 120, 3: 140, 4: 160 } },
    "Pula-pula grande": { descricao: "Pula-pula 4,27 m", precos: { 1: 90, 2: 140, 3: 160, 4: 180 } },
    "Multi Park": { descricao: "Multi Park", precos: { 1: 190, 2: 200, 3: 250, 4: 290 } },
    "Tobogã": { descricao: "Tobogã Premium", precos: { 1: 190, 2: 200, 3: 250, 4: 290 } }
  };

  for (const [nome, { descricao, precos }] of Object.entries(precosPorBrinquedo)) {
    const [brinquedo] = await Brinquedo.findOrCreate({ where: { nome }, defaults: { descricao } });
    for (const [duracaoHoras, valor] of Object.entries(precos)) {
      await PrecoBrinquedo.findOrCreate({
        where: { brinquedoId: brinquedo.id, duracaoHoras: Number(duracaoHoras) },
        defaults: { valor }
      });
    }
  }

  await ServicoExtra.findOrCreate({
    where: { nome: "Algodão doce" },
    defaults: { descricao: "Modelo industrial, cores azul e rosa", quantidadeOuTempo: "120 unidades", valor: 150.0 }
  });
  await ServicoExtra.findOrCreate({
    where: { nome: "Pipoca" },
    defaults: { descricao: "Pipoca normal", quantidadeOuTempo: "200 unidades", valor: 150.0 }
  });
  await ServicoExtra.findOrCreate({
    where: { nome: "Máquina de crepe" },
    defaults: { descricao: "Crepe tradicional no palito", quantidadeOuTempo: "Durante o evento", valor: 150.0 }
  });

  const localidades = [
    ["São Joãozinho", "QUADRA", true],
    ["Caluête", "QUADRA", true],
    ["O Cabeção", "GINASIO", false],
    ["Complexo Educacional Ernesto Reibel", "QUADRA", false],
    ["Na própria escola", "ESCOLA", false]
  ];
  for (const [nome, tipoEspaco, exigeTransporteTerceiros] of localidades) {
    await Localidade.findOrCreate({ where: { nome }, defaults: { tipoEspaco, exigeTransporteTerceiros } });
  }

  console.log("Catálogo (brinquedos, preços, serviços, localidades) OK.");
}

async function seedExemplo() {
  const clienteRepository = new ClienteRepository();
  const escolaRepository = new EscolaRepository();
  const localidadeRepository = new LocalidadeRepository();
  const orcamentoRepository = new OrcamentoRepository();
  const deslocamentoRepository = new DeslocamentoRepository();
  const locacaoRepository = new LocacaoRepository();
  const brinquedoRepository = new BrinquedoRepository();
  const itemLocacaoRepository = new ItemLocacaoRepository();

  const orcamentoService = new OrcamentoService(orcamentoRepository, clienteRepository, new UsuarioRepository());
  const deslocamentoService = new DeslocamentoService(deslocamentoRepository, orcamentoRepository, localidadeRepository);
  const locacaoService = new LocacaoService(
    locacaoRepository, orcamentoRepository, escolaRepository, localidadeRepository,
    deslocamentoRepository, brinquedoRepository, itemLocacaoRepository
  );

  const [cliente] = await Cliente.findOrCreate({
    where: { nome: "Prefeitura Municipal – Secretaria de Educação" },
    defaults: { tipo: "PREFEITURA" }
  });

  const nomesEscolas = [
    "João Pereira da Costa", "José Pereira de Oliveira", "Escola João Leite Gomes",
    "Escola Américo Porto", "Escola Francisco Sulpino de Araújo", "Escola Severino Tavares da Silva",
    "Escola Francisca Leite Vitorino", "Creche Mãe Janoca", "Manoel Alves Monteiro",
    "Complexo Educacional Ernesto Reibel"
  ];
  const escolas = {};
  for (const nome of nomesEscolas) {
    const [escola] = await Escola.findOrCreate({ where: { nome } });
    escolas[nome] = escola;
  }
  const localidadesExemplo = {};
  for (const nome of ["São Joãozinho", "Caluête", "O Cabeção", "Complexo Educacional Ernesto Reibel", "Na própria escola"]) {
    localidadesExemplo[nome] = await Localidade.findOne({ where: { nome } });
  }

  // Se já existir um orçamento com este número, não duplica (seed idempotente)
  const jaExiste = await require("./models").Orcamento.findOne({ where: { numero: "2026-0001" } });
  if (jaExiste) {
    console.log("Orçamento de exemplo 2026-0001 já existe — seed de exemplo não repetido.");
    return;
  }

  const orcamento = await orcamentoService.cadastrar({
    clienteId: cliente.id,
    titulo: "Dia das Crianças nas Escolas – Outubro/2026",
    dataEmissao: "2026-09-23"
  });

  const viagens = [
    { localidade: "São Joãozinho", data: "2026-10-02", descricao: "São Joãozinho – transporte" },
    { localidade: "Caluête", data: "2026-10-05", descricao: "Caluête – levar os brinquedos" },
    { localidade: "Caluête", data: "2026-10-06", descricao: "Caluête – buscar os brinquedos" }
  ];
  const deslocamentos = {};
  for (const v of viagens) {
    const deslocamento = await deslocamentoService.cadastrar(orcamento.id, {
      localidadeId: localidadesExemplo[v.localidade].id,
      dataDeslocamento: v.data,
      descricao: v.descricao,
      valor: 100.0
    });
    deslocamentos[`${v.localidade}|${v.data}`] = deslocamento;
  }

  const locacoes = [
    ["João Pereira da Costa", "São Joãozinho", "São Joãozinho|2026-10-02", "2026-10-02", "MANHA", "07:30", 31, 2],
    ["José Pereira de Oliveira", "São Joãozinho", "São Joãozinho|2026-10-02", "2026-10-02", "MANHA", null, 28, 2],
    ["Escola João Leite Gomes", "Caluête", "Caluête|2026-10-05", "2026-10-05", "MANHA", "07:30", 18, 2],
    ["Escola Américo Porto", "Caluête", "Caluête|2026-10-05", "2026-10-05", "MANHA", null, 47, 2],
    ["Escola Francisco Sulpino de Araújo", "Caluête", "Caluête|2026-10-05", "2026-10-05", "MANHA", "09:30", 30, 2],
    ["Escola Severino Tavares da Silva", "Caluête", "Caluête|2026-10-06", "2026-10-06", "MANHA", "07:30", 46, 3],
    ["Escola Severino Tavares da Silva", "Caluête", "Caluête|2026-10-06", "2026-10-06", "TARDE", "14:00", 53, 3],
    ["Escola Francisca Leite Vitorino", "Na própria escola", null, "2026-10-07", "MANHA", "07:30", 199, 3],
    ["Creche Mãe Janoca", "O Cabeção", null, "2026-10-08", "MANHA", "07:30", 125, 3],
    ["Creche Mãe Janoca", "O Cabeção", null, "2026-10-08", "TARDE", "14:00", 90, 3],
    ["Manoel Alves Monteiro", "O Cabeção", null, "2026-10-08", "MANHA", "11:00", 11, 2],
    ["Complexo Educacional Ernesto Reibel", "Complexo Educacional Ernesto Reibel", null, "2026-10-09", "MANHA", "07:30", 86, 3],
    ["Complexo Educacional Ernesto Reibel", "Complexo Educacional Ernesto Reibel", null, "2026-10-09", "TARDE", "14:00", 58, 3]
  ];

  for (const [escolaNome, localidadeNome, chaveDeslocamento, dataEvento, turno, horarioInicio, qtdAlunos, duracaoHoras] of locacoes) {
    await locacaoService.cadastrar(orcamento.id, {
      escolaId: escolas[escolaNome].id,
      localidadeId: localidadesExemplo[localidadeNome].id,
      deslocamentoId: chaveDeslocamento ? deslocamentos[chaveDeslocamento].id : null,
      dataEvento,
      turno,
      horarioInicio,
      qtdAlunos,
      duracaoHoras
    });
  }

  const totais = await orcamentoService.totais(orcamento.id);
  console.log(`Orçamento de exemplo ${orcamento.numero} criado.`);
  console.log(
    `Totais: subtotalBrinquedos=${totais.subtotalBrinquedos.toFixed(2)}  totalDeslocamento=${totais.totalDeslocamento.toFixed(2)}  totalGeral=${totais.totalGeral.toFixed(2)}`
  );
  console.log("Esperado pelo docs/dicionario-de-dados.md: 13.460,00 + 300,00 = 13.760,00");
}

async function seed() {
  await sequelize.sync();
  await seedCatalogo();
  await seedExemplo();
  await sequelize.close();
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
