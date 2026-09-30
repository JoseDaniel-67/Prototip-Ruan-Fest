class DeslocamentoController {
  constructor(service) { this.service = service; }
  criar = async (req, res) => res.status(201).json(await this.service.cadastrar(req.params.orcamentoId, req.body));
  listarDoOrcamento = async (req, res) => res.json(await this.service.listarDoOrcamento(req.params.orcamentoId));
  buscarPorId = async (req, res) => res.json(await this.service.buscarPorId(req.params.id));
  atualizar = async (req, res) => res.json(await this.service.atualizar(req.params.id, req.body));
  excluir = async (req, res) => { await this.service.excluir(req.params.id); res.status(204).send(); };
}
module.exports = DeslocamentoController;
