const { Router } = require("express");
const asyncHandler = require("../utils/asyncHandler");
const UsuarioRepository = require("../repositories/UsuarioRepository");
const UsuarioService = require("../services/UsuarioService");
const UsuarioController = require("../controllers/UsuarioController");

const controller = new UsuarioController(new UsuarioService(new UsuarioRepository()));
const router = Router();

router.post("/", asyncHandler(controller.criar));
router.get("/", asyncHandler(controller.listar));
router.get("/:id", asyncHandler(controller.buscarPorId));
router.put("/:id", asyncHandler(controller.atualizar));
router.delete("/:id", asyncHandler(controller.excluir));

module.exports = router;
