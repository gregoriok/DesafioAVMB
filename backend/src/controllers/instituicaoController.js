const Instituicao = require('../models/Instituicao');
const authService = require('../services/authService');

exports.registrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    const existe = await Instituicao.findOne({ where: { email } });
    if (existe) return res.status(400).json({ erro: "Email já cadastrado" });

    const senha_hash = await authService.hashSenha(senha);
    const instituicao = await Instituicao.create({ nome, email, senha_hash });

    res.status(201).json({ message: "Instituição criada com sucesso", id: instituicao.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;
    const instituicao = await Instituicao.findOne({ where: { email } });

    if (!instituicao || !(await authService.compararSenha(senha, instituicao.senha_hash))) {
      return res.status(401).json({ erro: "Credenciais inválidas" });
    }

    const token = authService.gerarToken(instituicao);
    res.json({ token, instituicao: { nome: instituicao.nome, email: instituicao.email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};