const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const EscolaRepository = require("../repositories/EscolaRepository");
const EscolaService = require("../services/EscolaService");
const EscolaController = require("../controllers/EscolaController");

const controller = new EscolaController(new EscolaService(new EscolaRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
