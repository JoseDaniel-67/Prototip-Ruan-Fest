const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const ItemLocacaoRepository = require("../repositories/ItemLocacaoRepository");
const LocacaoRepository = require("../repositories/LocacaoRepository");
const BrinquedoRepository = require("../repositories/BrinquedoRepository");
const ServicoExtraRepository = require("../repositories/ServicoExtraRepository");
const ItemLocacaoService = require("../services/ItemLocacaoService");
const ItemLocacaoController = require("../controllers/ItemLocacaoController");

const controller = new ItemLocacaoController(
  new ItemLocacaoService(new ItemLocacaoRepository(), new LocacaoRepository(), new BrinquedoRepository(), new ServicoExtraRepository())
);

const router = Router();

router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
