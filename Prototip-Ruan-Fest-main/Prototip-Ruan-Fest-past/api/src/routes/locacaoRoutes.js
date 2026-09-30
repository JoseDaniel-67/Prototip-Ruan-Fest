const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");

const LocacaoRepository = require("../repositories/LocacaoRepository");
const OrcamentoRepository = require("../repositories/OrcamentoRepository");
const EscolaRepository = require("../repositories/EscolaRepository");
const LocalidadeRepository = require("../repositories/LocalidadeRepository");
const DeslocamentoRepository = require("../repositories/DeslocamentoRepository");
const BrinquedoRepository = require("../repositories/BrinquedoRepository");
const ItemLocacaoRepository = require("../repositories/ItemLocacaoRepository");
const ServicoExtraRepository = require("../repositories/ServicoExtraRepository");
const LocacaoService = require("../services/LocacaoService");
const LocacaoController = require("../controllers/LocacaoController");
const ItemLocacaoService = require("../services/ItemLocacaoService");
const ItemLocacaoController = require("../controllers/ItemLocacaoController");

const locacaoRepository = new LocacaoRepository();
const itemLocacaoRepository = new ItemLocacaoRepository();
const brinquedoRepository = new BrinquedoRepository();

const locacaoController = new LocacaoController(
  new LocacaoService(
    locacaoRepository,
    new OrcamentoRepository(),
    new EscolaRepository(),
    new LocalidadeRepository(),
    new DeslocamentoRepository(),
    brinquedoRepository,
    itemLocacaoRepository
  )
);

const itemLocacaoController = new ItemLocacaoController(
  new ItemLocacaoService(itemLocacaoRepository, locacaoRepository, brinquedoRepository, new ServicoExtraRepository())
);

const router = Router();

router.get("/:id", asyncHandler(locacaoController.buscarPorId));
router.put("/:id", asyncHandler(locacaoController.atualizar));
router.delete("/:id", asyncHandler(locacaoController.excluir));

// Item extra, além dos itens padrão criados junto com a locação
router.post("/:locacaoId/itens", asyncHandler(itemLocacaoController.adicionar));

module.exports = router;
