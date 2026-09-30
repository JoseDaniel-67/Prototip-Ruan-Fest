const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");

const OrcamentoRepository = require("../repositories/OrcamentoRepository");
const ClienteRepository = require("../repositories/ClienteRepository");
const UsuarioRepository = require("../repositories/UsuarioRepository");
const OrcamentoService = require("../services/OrcamentoService");
const OrcamentoController = require("../controllers/OrcamentoController");

const LocacaoRepository = require("../repositories/LocacaoRepository");
const EscolaRepository = require("../repositories/EscolaRepository");
const LocalidadeRepository = require("../repositories/LocalidadeRepository");
const DeslocamentoRepository = require("../repositories/DeslocamentoRepository");
const BrinquedoRepository = require("../repositories/BrinquedoRepository");
const ItemLocacaoRepository = require("../repositories/ItemLocacaoRepository");
const LocacaoService = require("../services/LocacaoService");
const LocacaoController = require("../controllers/LocacaoController");

const DeslocamentoService = require("../services/DeslocamentoService");
const DeslocamentoController = require("../controllers/DeslocamentoController");

const orcamentoRepository = new OrcamentoRepository();
const localidadeRepository = new LocalidadeRepository();

const orcamentoController = new OrcamentoController(
  new OrcamentoService(orcamentoRepository, new ClienteRepository(), new UsuarioRepository())
);

const locacaoController = new LocacaoController(
  new LocacaoService(
    new LocacaoRepository(),
    orcamentoRepository,
    new EscolaRepository(),
    localidadeRepository,
    new DeslocamentoRepository(),
    new BrinquedoRepository(),
    new ItemLocacaoRepository()
  )
);

const deslocamentoController = new DeslocamentoController(
  new DeslocamentoService(new DeslocamentoRepository(), orcamentoRepository, localidadeRepository)
);

const router = Router();

router.post("/", asyncHandler(orcamentoController.criar));
router.get("/", asyncHandler(orcamentoController.listar));
router.get("/:id", asyncHandler(orcamentoController.buscarPorId));
router.put("/:id", asyncHandler(orcamentoController.atualizar));
router.delete("/:id", asyncHandler(orcamentoController.excluir));
router.get("/:id/totais", asyncHandler(orcamentoController.totais));
router.get("/:id/totais-por-escola", asyncHandler(orcamentoController.totalPorEscola));

// Locações do orçamento (a criação já gera os itens padrão)
router.post("/:orcamentoId/locacoes", asyncHandler(locacaoController.criar));
router.get("/:orcamentoId/locacoes", asyncHandler(locacaoController.listarDoOrcamento));

// Deslocamentos (viagens) do orçamento
router.post("/:orcamentoId/deslocamentos", asyncHandler(deslocamentoController.criar));
router.get("/:orcamentoId/deslocamentos", asyncHandler(deslocamentoController.listarDoOrcamento));

module.exports = router;
