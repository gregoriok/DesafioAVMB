const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const authService = {
  hashSenha: async (senha) => {
    return await bcrypt.hash(senha, 10);
  },

  compararSenha: async (senha, hash) => {
    return await bcrypt.compare(senha, hash);
  },

  gerarToken: (instituicao) => {
    return jwt.sign(
      { id: instituicao.id, email: instituicao.email },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
  }
};

module.exports = authService;