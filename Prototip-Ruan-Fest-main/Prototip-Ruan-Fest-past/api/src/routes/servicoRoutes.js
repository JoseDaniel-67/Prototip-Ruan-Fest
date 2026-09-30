const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const ServicoExtraRepository = require("../repositories/ServicoExtraRepository");
const ServicoExtraService = require("../services/ServicoExtraService");
const ServicoExtraController = require("../controllers/ServicoExtraController");

const controller = new ServicoExtraController(new ServicoExtraService(new ServicoExtraRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
