// src/services/documentService.js
const crypto = require('crypto');
const { create } = require('xmlbuilder2');
const fs = require('fs');
const path = require('path');

const documentService = {
  gerarHash: (aluno) => {
    const data = `${aluno.cpf}-${aluno.curso.codigo}-${Date.now()}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  },

  gerarXML: async (aluno, hash) => {
    const root = create({ version: '1.0', encoding: 'UTF-8' })
      .ele('comprovante')
        .ele('aluno')
          .ele('nome').txt(aluno.nome).up()
          .ele('cpf').txt(aluno.cpf).up()
        .up()
        .ele('curso')
          .ele('nome').txt(aluno.curso.nome).up()
          .ele('codigo').txt(aluno.curso.codigo).up()
        .up()
        .ele('validacao')
          .ele('codigo').txt(hash).up()
          .ele('url_consulta').txt(`${process.env.APP_URL}/validar/${hash}`).up()
        .up()
      .end({ prettyPrint: true });

    const fileName = `${hash}.xml`;
    const filePath = path.join(__dirname, '../../uploads', fileName);
    
    fs.writeFileSync(filePath, root);
    return filePath;
  }
};

module.exports = documentService;