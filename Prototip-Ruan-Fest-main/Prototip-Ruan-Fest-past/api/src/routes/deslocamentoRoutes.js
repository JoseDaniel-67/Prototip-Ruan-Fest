const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const DeslocamentoRepository = require("../repositories/DeslocamentoRepository");
const OrcamentoRepository = require("../repositories/OrcamentoRepository");
const LocalidadeRepository = require("../repositories/LocalidadeRepository");
const DeslocamentoService = require("../services/DeslocamentoService");
const DeslocamentoController = require("../controllers/DeslocamentoController");

const controller = new DeslocamentoController(
  new DeslocamentoService(new DeslocamentoRepository(), new OrcamentoRepository(), new LocalidadeRepository())
);

const router = Router();

router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
