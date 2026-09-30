const app = require("./app");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3000;

async function iniciar() {
  try {
    await sequelize.authenticate();
    console.log("Banco conectado!");

    await sequelize.sync();
    console.log("Tabelas sincronizadas.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Erro ao iniciar a aplicação:", error);
    process.exit(1);
  }
}

iniciar();
