const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const BrinquedoRepository = require("../repositories/BrinquedoRepository");
const BrinquedoService = require("../services/BrinquedoService");
const BrinquedoController = require("../controllers/BrinquedoController");

const controller = new BrinquedoController(new BrinquedoService(new BrinquedoRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));
router.put("/:id/precos", asyncHandler(controller.definirPrecos));

module.exports = router;
