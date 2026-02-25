const Aluno = require('../models/Aluno');
const Curso = require('../models/Curso');
const path = require('path');
const fs = require('fs');

exports.validarHash = async (req, res) => {
  try {
    const { hash } = req.params;

    const aluno = await Aluno.findOne({
      where: { 
        hash: hash,
        status: 'ativo'
      },
      include: [{ model: Curso, as: 'curso' }]
    });

    if (!aluno) {
      return res.status(404).json({
        status: "error",
        mensagem: "Documento inválido, inexistente ou cancelado."
      });
    }

    res.json({
      status: "success",
      data: {
        nome: aluno.nome,
        cpf: aluno.cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.***.***-$4"),
        curso: {
          nome: aluno.curso.nome,
          codigo: aluno.curso.codigo,
          docente: aluno.curso.docente,
          concluido_em: aluno.curso.dt_fim
        }
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.downloadXML = async (req, res) => {
  try {
    const { hash } = req.params;
    const aluno = await Aluno.findOne({ where: { hash, status: 'ativo' } });

    if (!aluno || !aluno.file_path) {
      return res.status(404).send("Arquivo não encontrado.");
    }

    res.download(aluno.file_path);
  } catch (error) {
    res.status(500).send("Erro ao processar download.");
  }
};