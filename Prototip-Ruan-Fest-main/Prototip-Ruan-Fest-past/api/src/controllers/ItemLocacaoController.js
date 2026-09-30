class ItemLocacaoController {
  constructor(service) { this.service = service; }
  adicionar = async (req, res) => res.status(201).json(await this.service.adicionar(req.params.locacaoId, req.body));
  atualizar = async (req, res) => res.json(await this.service.atualizar(req.params.id, req.body));
  excluir = async (req, res) => { await this.service.excluir(req.params.id); res.status(204).send(); };
}
module.exports = ItemLocacaoController;
