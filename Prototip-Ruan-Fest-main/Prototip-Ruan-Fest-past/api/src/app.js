const express = require("express");

const usuarioRoutes = require("./routes/usuarioRoutes");
const clienteRoutes = require("./routes/clienteRoutes");
const escolaRoutes = require("./routes/escolaRoutes");
const localidadeRoutes = require("./routes/localidadeRoutes");
const brinquedoRoutes = require("./routes/brinquedoRoutes");
const servicoRoutes = require("./routes/servicoRoutes");
const orcamentoRoutes = require("./routes/orcamentoRoutes");
const deslocamentoRoutes = require("./routes/deslocamentoRoutes");
const locacaoRoutes = require("./routes/locacaoRoutes");
const itemLocacaoRoutes = require("./routes/itemLocacaoRoutes");
const { rotaNaoEncontrada, errorHandler } = require("./middlewares/errorHandler");

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ mensagem: "API da Ruan Fest no ar" });
});

app.use("/usuarios", usuarioRoutes);
app.use("/clientes", clienteRoutes);
app.use("/escolas", escolaRoutes);
app.use("/localidades", localidadeRoutes);
app.use("/brinquedos", brinquedoRoutes);
app.use("/servicos", servicoRoutes);
app.use("/orcamentos", orcamentoRoutes);
app.use("/deslocamentos", deslocamentoRoutes);
app.use("/locacoes", locacaoRoutes);
app.use("/itens", itemLocacaoRoutes);

app.use(rotaNaoEncontrada);
app.use(errorHandler);

module.exports = app;
