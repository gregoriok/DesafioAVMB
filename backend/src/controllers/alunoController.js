const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const documentService = require('../services/documentService');
const axios = require('axios');

exports.importar = async (req, res) => {
  try {
    const dadosAluno = req.body;
    const instituicaoId = req.instituicaoId;

    const hash = documentService.gerarHash(dadosAluno);

    const filePath = await documentService.gerarXML(dadosAluno, hash);

    const aluno = await Aluno.create({
      nome: dadosAluno.nome,
      cpf: dadosAluno.cpf,
      dt_nascimento: dadosAluno.dt_nascimento,
      instituicao_id: instituicaoId,
      hash: hash,
      file_path: filePath
    });

    await Curso.create({
      ...dadosAluno.curso,
      aluno_id: aluno.id
    });

    if (dadosAluno.url_callback) {
      axios.post(dadosAluno.url_callback, {
        nome: aluno.nome,
        cpf: aluno.cpf,
        validation_code: hash,
        url_consulta: `http://localhost:3000/validar/${hash}`,
        hash: hash
      }).catch(err => console.log("Erro ao enviar Webhook:", err.message));
    }

    res.status(201).json({ status: "success", hash });
  } catch (error) {
    res.status(500).json({ status: "error", mensagem: error.message });
  }
};

exports.listar = async (req, res) => {
  try {
    const instituicaoId = req.instituicaoId;
    const alunos = await Aluno.findAll({ where: { instituicao_id: instituicaoId },
    include: [{
        model: Curso,
        as: 'curso',
        attributes: ['nome', 'codigo']
      }] });
    res.json(alunos);
  } catch (error) {
    res.status(500).json({ status: "error", mensagem: error.message });
  }
};

exports.listarPorId = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await Aluno.findOne({ where: { id },
    include: [{
        model: Curso,
        as: 'curso',
        attributes: ['nome', 'codigo']
      }] });
    if (!aluno) {
      return res.status(404).json({ status: "error", mensagem: "Aluno não encontrado" });
    } else if (aluno.instituicao_id !== req.instituicaoId) {
      return res.status(403).json({ status: "error", mensagem: "Acesso negado" });
    }
    res.json(aluno);
  } catch (error) {
    res.status(500).json({ status: "error", mensagem: error.message });
  }
};

exports.atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const dadosAtualizados = req.body;
    const aluno = await Aluno.findOne({ where: { id } });
    if (!aluno) {
      return res.status(404).json({ status: "error", mensagem: "Aluno não encontrado" });
    }
    if (aluno.instituicao_id !== req.instituicaoId) {
      return res.status(403).json({ status: "error", mensagem: "Acesso negado" });
    }
    await aluno.update(dadosAtualizados);
    res.json({ status: "success", aluno });
  } catch (error) {
    res.status(500).json({ status: "error", mensagem: error.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    const { id } = req.params;
    const aluno = await Aluno.findOne({ where: { id } });
    if (!aluno) {
      return res.status(404).json({ status: "error", mensagem: "Aluno não encontrado" });
    }
    if (aluno.instituicao_id !== req.instituicaoId) {
      return res.status(403).json({ status: "error", mensagem: "Acesso negado" });
    }
    aluno.status = 'cancelado';
    await aluno.update({ status: aluno.status });
    res.json({ status: "success", mensagem: "Aluno cancelado com sucesso" });
  } catch (error) {
    res.status(500).json({ status: "error", mensagem: error.message });
  }
};