const AppError = require("../utils/AppError");
const pick = require("../utils/pick");

const CAMPOS = ["nome", "descricao", "ativo"];

class BrinquedoService {
  constructor(repository) {
    this.repository = repository;
  }

  cadastrar(dados) { return this.repository.criar(pick(dados, CAMPOS)); }
  listar() { return this.repository.buscarTodos(); }

  async buscarPorId(id) {
    const brinquedo = await this.repository.buscarPorId(id);
    if (!brinquedo) throw new AppError(404, "Brinquedo não encontrado");
    return brinquedo;
  }

  async atualizar(id, dados) {
    const brinquedo = await this.buscarPorId(id);
    return this.repository.atualizar(brinquedo, pick(dados, CAMPOS));
  }

  async excluir(id) {
    const brinquedo = await this.buscarPorId(id);
    await this.repository.excluir(brinquedo);
  }

  // PUT /brinquedos/:id/precos  body: { precos: [{ duracaoHoras, valor }, ...] }
  async definirPrecos(id, precos) {
    await this.buscarPorId(id);
    if (!Array.isArray(precos) || precos.length === 0) {
      throw new AppError(400, "Envie 'precos' como uma lista de { duracaoHoras, valor }");
    }
    for (const p of precos) {
      if (!Number.isInteger(p.duracaoHoras) || p.duracaoHoras < 1 || p.duracaoHoras > 24) {
        throw new AppError(400, "duracaoHoras deve ser um inteiro entre 1 e 24");
      }
      if (typeof p.valor !== "number" || p.valor < 0) {
        throw new AppError(400, "valor deve ser um número maior ou igual a 0");
      }
    }
    return this.repository.definirPrecos(id, precos);
  }
}

module.exports = BrinquedoService;
