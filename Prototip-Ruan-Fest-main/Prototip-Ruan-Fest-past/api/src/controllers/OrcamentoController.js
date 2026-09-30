class OrcamentoController {
  constructor(service) { this.service = service; }
  criar = async (req, res) => res.status(201).json(await this.service.cadastrar(req.body));
  listar = async (req, res) => res.json(await this.service.listar());
  buscarPorId = async (req, res) => res.json(await this.service.buscarPorId(req.params.id));
  atualizar = async (req, res) => res.json(await this.service.atualizar(req.params.id, req.body));
  excluir = async (req, res) => { await this.service.excluir(req.params.id); res.status(204).send(); };
  totais = async (req, res) => res.json(await this.service.totais(req.params.id));
  totalPorEscola = async (req, res) => res.json(await this.service.totalPorEscola(req.params.id));
}
module.exports = OrcamentoController;
