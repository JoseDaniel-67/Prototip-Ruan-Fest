const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const LocalidadeRepository = require("../repositories/LocalidadeRepository");
const LocalidadeService = require("../services/LocalidadeService");
const LocalidadeController = require("../controllers/LocalidadeController");

const controller = new LocalidadeController(new LocalidadeService(new LocalidadeRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
