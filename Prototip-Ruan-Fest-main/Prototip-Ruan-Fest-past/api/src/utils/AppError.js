// Erro "esperado" (regra de negócio), com status HTTP associado.
class AppError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "AppError";
    this.status = status;
  }
}

module.exports = AppError;
