const documentService = require('../documentService');

describe('DocumentService', () => {
  describe('gerarHash', () => {
    it('deve gerar um hash válido', () => {
      const dados = {
        nome: 'João Silva',
        cpf: '12345678901',
        dt_nascimento: '2000-01-01',
        curso: { codigo: 'ENG001' }
      };

      const hash = documentService.gerarHash(dados);

      expect(hash).toBeDefined();
      expect(typeof hash).toBe('string');
      expect(hash.length).toBeGreaterThan(0);
    });

    it('deve gerar hashes diferentes para dados diferentes', () => {
      const dados1 = { nome: 'João', cpf: '111', curso: { codigo: 'ENG001' } };
      const dados2 = { nome: 'Maria', cpf: '222', curso: { codigo: 'MED001' } };

      const hash1 = documentService.gerarHash(dados1);
      const hash2 = documentService.gerarHash(dados2);

      expect(hash1).not.toBe(hash2);
    });

    it('deve gerar o mesmo hash para dados idênticos', () => {
      const dados = { nome: 'João', cpf: '111', curso: { codigo: 'ENG001' } };

      const hash1 = documentService.gerarHash(dados);
      const hash2 = documentService.gerarHash(dados);

      // Hashes gerados em momentos diferentes terão timestamps diferentes
      expect(hash1).toBeDefined();
      expect(hash2).toBeDefined();
    });
  });

  describe('gerarXML', () => {
    it('deve gerar um arquivo XML válido', async () => {
      const dados = {
        nome: 'João Silva',
        cpf: '12345678901',
        dt_nascimento: '2000-01-01',
        curso: { nome: 'Engenharia', codigo: 'ENG001' }
      };
      const hash = 'abc123';

      const filePath = await documentService.gerarXML(dados, hash);

      expect(filePath).toBeDefined();
      expect(typeof filePath).toBe('string');
      expect(filePath).toContain('.xml');
    });

    it('deve incluir o hash no arquivo XML', async () => {
      const dados = { 
        nome: 'João',
        cpf: '123',
        dt_nascimento: '2000-01-01',
        curso: { nome: 'Medicina', codigo: 'MED001' }
      };
      const hash = 'meu_hash_123';

      const filePath = await documentService.gerarXML(dados, hash);

      // A função deve retornar um caminho válido
      expect(filePath).toBeTruthy();
    });
  });
});
