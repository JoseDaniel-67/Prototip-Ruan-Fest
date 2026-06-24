const express     = require('express');
const swaggerUi   = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();

app.use(express.json());

// documentação swagger
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// rota raiz
app.get('/', (req, res) => {
    res.json({ mensagem: 'Ruan Fest API funcionando!' });
});

// brinquedos
/**
 * @swagger
 * /brinquedos:
 *   get:
 *     summary: Lista todos os brinquedos
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
app.get('/brinquedos', (req, res) => {
    res.json([
        { id: 1, nome: 'Pula-Pula Grande',  comprimento: 4.27, altura: 2.12 },
        { id: 2, nome: 'Pula-Pula Pequeno', comprimento: 2.50, altura: 1.88 }
    ]);
});

// agendamentos
/**
 * @swagger
 * /agendamentos:
 *   get:
 *     summary: Lista todos os agendamentos
 *     responses:
 *       200:
 *         description: Lista retornada com sucesso
 */
app.get('/agendamentos', (req, res) => {
    res.json({ mensagem: 'Lista de agendamentos' });
});

/**
 * @swagger
 * /agendamentos:
 *   post:
 *     summary: Cria um novo agendamento
 *     responses:
 *       201:
 *         description: Agendamento criado com sucesso
 */
app.post('/agendamentos', (req, res) => {
    res.status(201).json({ mensagem: 'Agendamento criado' });
});

app.listen(3000, () => {
    console.log('Servidor rodando em http://localhost:3000');
    console.log('Documentação em http://localhost:3000/docs');
});