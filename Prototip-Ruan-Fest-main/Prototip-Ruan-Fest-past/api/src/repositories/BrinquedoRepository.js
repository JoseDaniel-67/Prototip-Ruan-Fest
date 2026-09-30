const { Brinquedo, PrecoBrinquedo } = require("../models");

class BrinquedoRepository {
  criar(dados) { return Brinquedo.create(dados); }

  buscarTodos() {
    return Brinquedo.findAll({
      include: [{ model: PrecoBrinquedo, attributes: ["duracaoHoras", "valor"] }],
      order: [["nome", "ASC"]]
    });
  }

  buscarPorId(id) {
    return Brinquedo.findByPk(id, {
      include: [{ model: PrecoBrinquedo, attributes: ["id", "duracaoHoras", "valor"] }]
    });
  }

  atualizar(brinquedo, dados) { return brinquedo.update(dados); }
  excluir(brinquedo) { return brinquedo.destroy(); }

  // Preço do brinquedo para uma duração específica (usado ao montar os itens padrão da locação)
  buscarPreco(brinquedoId, duracaoHoras, options = {}) {
    return PrecoBrinquedo.findOne({ where: { brinquedoId, duracaoHoras }, ...options });
  }

  // Upsert da tabela de preços por duração (PUT /brinquedos/:id/precos)
  async definirPrecos(brinquedoId, precos) {
    for (const { duracaoHoras, valor } of precos) {
      const [registro] = await PrecoBrinquedo.findOrCreate({
        where: { brinquedoId, duracaoHoras },
        defaults: { valor }
      });
      if (Number(registro.valor) !== Number(valor)) {
        await registro.update({ valor });
      }
    }
    return this.buscarPorId(brinquedoId);
  }
}

module.exports = BrinquedoRepository;
