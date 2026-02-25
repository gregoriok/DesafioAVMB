const alunoController = require('../alunoController');
const axios = require('axios');

// Mock das dependências - mocks simples sem Sequelize
jest.mock('../../models/Aluno', () => {
  return {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn()
  };
});

jest.mock('../../models/Curso', () => {
  return {
    create: jest.fn()
  };
});

jest.mock('../../services/documentService');
jest.mock('axios');

const Aluno = require('../../models/Aluno');
const Curso = require('../../models/Curso');
const documentService = require('../../services/documentService');

describe('AlunoController', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('importar', () => {
    it('deve criar um aluno com sucesso', async () => {
      const req = {
        body: {
          nome: 'João Silva',
          cpf: '12345678901',
          dt_nascimento: '2000-01-01',
          url_callback: 'http://example.com/callback',
          curso: {
            nome: 'Engenharia',
            codigo: 'ENG001'
          }
        },
        instituicaoId: 1
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      documentService.gerarHash.mockReturnValue('hash123');
      documentService.gerarXML.mockResolvedValue('/path/to/file.xml');
      Aluno.create.mockResolvedValue({ 
        id: 1, 
        nome: 'João Silva', 
        cpf: '12345678901' 
      });
      Curso.create.mockResolvedValue({ id: 1 });
      axios.post.mockResolvedValue({});

      await alunoController.importar(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: 'success', hash: 'hash123' });
      expect(Aluno.create).toHaveBeenCalled();
      expect(Curso.create).toHaveBeenCalled();
    });

    it('deve retornar erro 500 se houver falha', async () => {
      const req = {
        body: { nome: 'João' },
        instituicaoId: 1
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      documentService.gerarHash.mockImplementation(() => {
        throw new Error('Erro ao gerar hash');
      });

      await alunoController.importar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        mensagem: 'Erro ao gerar hash'
      });
    });
  });

  describe('listar', () => {
    it('deve retornar lista de alunos', async () => {
      const mockAlunos = [
        { id: 1, nome: 'João', cpf: '123', curso: { nome: 'Engenharia' } }
      ];

      const req = { instituicaoId: 1 };
      const res = { json: jest.fn() };

      Aluno.findAll.mockResolvedValue(mockAlunos);

      await alunoController.listar(req, res);

      expect(Aluno.findAll).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalledWith(mockAlunos);
    });

    it('deve retornar erro se falhar', async () => {
      const req = { instituicaoId: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Aluno.findAll.mockRejectedValue(new Error('Erro no banco'));

      await alunoController.listar(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('listarPorId', () => {
    it('deve retornar aluno encontrado', async () => {
      const mockAluno = { id: 1, nome: 'João', cpf: '123', instituicao_id: 1 };
      const req = { params: { id: 1 }, instituicaoId: 1 };
      const res = { json: jest.fn() };

      Aluno.findOne.mockResolvedValue(mockAluno);

      await alunoController.listarPorId(req, res);

      expect(res.json).toHaveBeenCalledWith(mockAluno);
    });

    it('deve retornar 404 se não encontrado', async () => {
      const req = { params: { id: 999 }, instituicaoId: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(null);

      await alunoController.listarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('deve retornar 403 se acesso negado', async () => {
      const mockAluno = { id: 1, instituicao_id: 2 };
      const req = { params: { id: 1 }, instituicaoId: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(mockAluno);

      await alunoController.listarPorId(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });

  describe('atualizar', () => {
    it('deve atualizar aluno com sucesso', async () => {
      const mockAluno = {
        id: 1,
        nome: 'João',
        instituicao_id: 1,
        update: jest.fn().mockResolvedValue()
      };

      const req = {
        params: { id: 1 },
        body: { nome: 'João Silva' },
        instituicaoId: 1
      };
      const res = {
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(mockAluno);

      await alunoController.atualizar(req, res);

      expect(mockAluno.update).toHaveBeenCalledWith({ nome: 'João Silva' });
      expect(res.json).toHaveBeenCalled();
    });

    it('deve retornar 404 se não encontrado', async () => {
      const req = {
        params: { id: 999 },
        body: { nome: 'João' },
        instituicaoId: 1
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(null);

      await alunoController.atualizar(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('deletar', () => {
    it('deve deletar aluno com sucesso', async () => {
      const mockAluno = {
        id: 1,
        instituicao_id: 1,
        update: jest.fn().mockResolvedValue()
      };

      const req = { params: { id: 1 }, instituicaoId: 1 };
      const res = {
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(mockAluno);

      await alunoController.deletar(req, res);

      expect(mockAluno.update).toHaveBeenCalled();
      expect(res.json).toHaveBeenCalled();
    });

    it('deve retornar 403 se acesso negado', async () => {
      const mockAluno = { id: 1, instituicao_id: 2 };
      const req = { params: { id: 1 }, instituicaoId: 1 };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn()
      };

      Aluno.findOne.mockResolvedValue(mockAluno);

      await alunoController.deletar(req, res);

      expect(res.status).toHaveBeenCalledWith(403);
    });
  });
});
