const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
require('dotenv').config();

// Importação das Rotas
const authRoutes = require('./routes/authRoutes');
const alunoRoutes = require('./routes/alunoRoutes');
const publicRoutes = require('./routes/publicRoutes');

const app = express();

app.use(cors());
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);     // Registro e Login
app.use('/api/alunos', alunoRoutes); // Importação (Protegida)
app.use('/', publicRoutes);          // Consulta Pública (Raiz)

// Sincronização do Banco e Start
const PORT = process.env.PORT || 3000;

sequelize.sync({ force: false }).then(() => {
  console.log('📦 MySQL conectado e sincronizado');
  app.listen(PORT, () => console.log(`🚀 Server rodando na porta ${PORT}`));
});