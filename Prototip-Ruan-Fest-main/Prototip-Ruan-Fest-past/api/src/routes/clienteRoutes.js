const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const ClienteRepository = require("../repositories/ClienteRepository");
const ClienteService = require("../services/ClienteService");
const ClienteController = require("../controllers/ClienteController");

const controller = new ClienteController(new ClienteService(new ClienteRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
