const AppError = require("../utils/AppError");

function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: "Rota não encontrada" });
}

// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  if (err instanceof AppError) {
    return res.status(err.status).json({ erro: err.message });
  }

  // Violação de UNIQUE (ex.: nome de escola repetido, locação duplicada)
  if (err.name === "SequelizeUniqueConstraintError") {
    const campos = err.errors.map((e) => e.path).join(", ");
    return res.status(409).json({ erro: `Já existe um registro com este valor: ${campos}` });
  }

  // Violação de FOREIGN KEY (ex.: excluir cliente que já tem orçamento)
  if (err.name === "SequelizeForeignKeyConstraintError") {
    return res.status(409).json({ erro: "Operação não permitida: existem registros relacionados a este item" });
  }

  // Validações do Model (campo obrigatório, CHECK de enum, "exatamente um dos dois"...)
  if (err.name === "SequelizeValidationError") {
    return res.status(400).json({
      erro: "Erro de validação",
      detalhes: err.errors.map((e) => ({ campo: e.path, mensagem: e.message }))
    });
  }

  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ erro: "JSON inválido no corpo da requisição" });
  }

  console.error(err);
  return res.status(500).json({ erro: "Erro interno do servidor" });
}

module.exports = { rotaNaoEncontrada, errorHandler };
