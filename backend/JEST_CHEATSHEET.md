# 📋 Jest Cheat Sheet para Backend

## Executar Testes

```bash
npm test                 # Executar tudo
npm run test:watch      # Modo watch
npm run test:coverage   # Cobertura
```

## Estrutura Básica

```javascript
describe('Nome da Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve fazer algo', () => {
    // Teste aqui
  });
});
```

## Mock de Funções

```javascript
// Simples
const mock = jest.fn();
const mock = jest.fn().mockReturnValue('valor');
const mock = jest.fn().mockResolvedValue({ id: 1 });
const mock = jest.fn().mockRejectedValue(new Error('erro'));

// Modais inteiros
jest.mock('../../models/Aluno', () => ({
  create: jest.fn(),
  findAll: jest.fn()
}));
```

## Assertions Comuns

```javascript
expect(valor).toBe(valor);                    // Igualdade exata
expect(valor).toEqual({ a: 1 });              // Valor igual
expect(valor).toBeTruthy();                   // True
expect(valor).toBeFalsy();                    // False
expect(array).toHaveLength(3);                // Tamanho
expect(string).toContain('texto');            // Contém
expect(func).toThrow(Error);                  // Erro ao chamar
expect(func).toHaveBeenCalled();              // Foi chamado
expect(func).toHaveBeenCalledWith(arg);       // Chamado com args
expect(func).toHaveBeenCalledTimes(1);        // Quantas vezes
```

## Testing Async/Await

```javascript
it('deve ser async', async () => {
  const result = await function();
  expect(result).toBe('valor');
});

it('promisses', () => {
  return promise.then(result => {
    expect(result).toBe('valor');
  });
});
```

## Padrão AAA

```javascript
it('caso de teste', () => {
  // ARRANGE - Preparar dados
  const req = { body: { nome: 'João' } };
  const res = { json: jest.fn() };

  // ACT - Executar função
  controller.funcao(req, res);

  // ASSERT - Verificar resultado
  expect(res.json).toHaveBeenCalled();
});
```

## Testes de Error Handling

```javascript
it('deve capturar erro', async () => {
  Model.create.mockRejectedValue(new Error('DB Error'));
  
  await controller.importar(req, res);
  
  expect(res.status).toHaveBeenCalledWith(500);
});
```

## Testes de Webhooks/HTTP

```javascript
it('deve chamar webhook', async () => {
  axios.post.mockResolvedValue({});
  
  await controller.funcao(req, res);
  
  expect(axios.post).toHaveBeenCalledWith(
    'http://url.com',
    expect.objectContaining({ key: 'valor' })
  );
});
```

## Testes de Validação

```javascript
it('deve validar acesso', async () => {
  const aluno = { instituicao_id: 2 };
  const req = { instituicaoId: 1 };
  
  Aluno.findOne.mockResolvedValue(aluno);
  await controller.listarPorId(req, res);
  
  expect(res.status).toHaveBeenCalledWith(403);
});
```

## Testes Parametrizados

```javascript
describe.each([
  [1, 2, 3],
  [4, 5, 9],
])('soma de %i + %i = %i', (a, b, expected) => {
  it('resultado correto', () => {
    expect(a + b).toBe(expected);
  });
});
```

## Setup/Teardown

```javascript
beforeAll(() => {
  // Roda 1x antes de todos os testes
});

beforeEach(() => {
  // Roda antes de cada teste
});

afterEach(() => {
  // Roda depois de cada teste
});

afterAll(() => {
  // Roda 1x depois de todos
});
```

## Exemplo Real Completo

```javascript
describe('alunoController.importar', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        nome: 'João',
        cpf: '123',
        dt_nascimento: '2000-01-01',
        curso: { nome: 'Eng', codigo: 'ENG001' }
      },
      instituicaoId: 1
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    jest.clearAllMocks();
  });

  it('deve criar aluno com sucesso', async () => {
    // Mock
    documentService.gerarHash.mockReturnValue('hash123');
    documentService.gerarXML.mockResolvedValue('/path.xml');
    Aluno.create.mockResolvedValue({ id: 1, ...req.body });
    Curso.create.mockResolvedValue({ id: 1 });

    // Executar
    await alunoController.importar(req, res);

    // Verificar
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      hash: 'hash123'
    });
    expect(Aluno.create).toHaveBeenCalled();
  });

  it('deve retornar erro 500', async () => {
    documentService.gerarHash.mockImplementation(() => {
      throw new Error('Erro');
    });

    await alunoController.importar(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
  });
});
```
---

**Lembre-se:** Testes bons = código confiável + refatoração segura! 🚀

