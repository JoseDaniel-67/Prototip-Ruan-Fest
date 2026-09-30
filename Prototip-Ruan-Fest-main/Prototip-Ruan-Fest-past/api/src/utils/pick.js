// Copia apenas os campos permitidos de um objeto (evita que o cliente
// envie campos indevidos, como "id", no corpo da requisição).
module.exports = function pick(objeto, campos) {
  const origem = objeto || {};
  const resultado = {};
  for (const campo of campos) {
    if (origem[campo] !== undefined) resultado[campo] = origem[campo];
  }
  return resultado;
};
