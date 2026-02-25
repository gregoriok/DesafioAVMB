# Guia Completo de Testes Unitários

## Instalação

Dependências já instaladas:
- **Jest**: Framework de testes
- **jest-mock-extended**: Utilitários avançados para mocks

## Scripts Disponíveis

```bash
# Executar todos os testes
npm test

# Executar testes em modo "watch" (re-executar ao salvar arquivos)
npm run test:watch

# Gerar relatório de cobertura de testes
npm run test:coverage
```

## Estrutura de Testes

```
src/
├── controllers/
│   └── __tests__/
│       └── alunoController.test.js
├── models/
│   └── __tests__/
│       └── aluno.test.js
├── services/
│   └── __tests__/
│       └── documentService.test.js
└── routes/
    └── __tests__/
        └── routes.test.js
```

## Tipos de Testes Implementados

### 1. **Testes Unitários** (Controllers & Services)

Testam funções isoladamente usando **mocks** para dependências.

**Exemplo: AlunoController**
```javascript
describe('AlunoController - importar', () => {
  it('deve criar um aluno com sucesso', async () => {
    // Arrange (Preparar)
    const req = { body: { nome: 'João' }, instituicaoId: 1 };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    
    // Act (Executar)
    await alunoController.importar(req, res);
    
    // Assert (Verificar)
    expect(res.status).toHaveBeenCalledWith(201);
  });
});
```

**Vantagens:**
- ✅ Rápidos
- ✅ Fáceis de debugar
- ✅ Não dependem de banco de dados
- ✅ Coverage alto

### 2. **Testes de Integração** (Routes)

Testam a integração entre controller, middleware e rotas.

```javascript
describe('GET /api/alunos', () => {
  it('deve retornar lista de alunos', async () => {
    const response = await request(app)
      .get('/api/alunos')
      .set('Authorization', 'Bearer token');
    
    expect(response.status).toBe(200);
  });
});
```

**Vantagens:**
- ✅ Testam fluxo real da API
- ✅ Detectam problemas de integração
- ✅ Validam autenticação

### 3. **Testes de Modelos** (Sequelize)

Testam validações e relacionamentos dos modelos.

```javascript
describe('Aluno Model', () => {
  it('CPF deve ser único', () => {
    // Testar constraint de unicidade
  });
});
```

## Boas Práticas para Testes

### ✅ DO (Fazer)

```javascript
// 1. Use nomes descritivos
it('deve retornar erro 404 quando aluno não é encontrado', async () => {

// 2. Organize com describe
describe('alunoController', () => {
  describe('importar', () => {
    // Seus testes aqui
  });
});

// 3. Use beforeEach para limpeza
beforeEach(() => {
  jest.clearAllMocks();
});

// 4. Teste casos de sucesso E erro
it('deve criar aluno com sucesso', () => { });
it('deve retornar erro com dados inválidos', () => { });

// 5. Use AAA pattern (Arrange, Act, Assert)
const req = { /* dados */ };           // Arrange
await controller.importar(req, res);   // Act
expect(res.status).toHaveBeenCalled(); // Assert
```

### ❌ DON'T (Evitar)

```javascript
// ❌ Nomes genéricos
it('funciona', () => { });

// ❌ Testes muito longos (>15 linhas)
it('deve fazer muitas coisas', () => {
  // 50 linhas de código
});

// ❌ Testes interdependentes
it('primeiro', () => { estado = 1; });
it('segundo', () => { expect(estado).toBe(1); }); // Depende do anterior

// ❌ Testes lentos no banco de dados
it('buscar aluno no BD', () => {
  // Usar database.query() // ❌ Lento
  // Usar mock // ✅ Rápido
});
```

## Mock e Stub

### Mock (Simular comportamento)
```javascript
jest.mock('../../models/Aluno');
Aluno.create.mockResolvedValue({ id: 1, nome: 'João' });
```

### Spy (Monitorar chamadas)
```javascript
const spy = jest.spyOn(axios, 'post');
expect(spy).toHaveBeenCalledWith('url', data);
```

## Exemplos por Tipo de Teste

### Testando Async/Promises
```javascript
it('deve retornar dados após promise resolver', async () => {
  Aluno.findAll.mockResolvedValue([{ id: 1 }]);
  
  await controller.listar(req, res);
  
  expect(res.json).toHaveBeenCalledWith([{ id: 1 }]);
});
```

### Testando Erros
```javascript
it('deve retornar 500 em caso de erro', async () => {
  Aluno.create.mockRejectedValue(new Error('DB Error'));
  
  await controller.importar(req, res);
  
  expect(res.status).toHaveBeenCalledWith(500);
});
```

### Testando Chamadas HTTP
```javascript
it('deve fazer post para webhook', async () => {
  axios.post.mockResolvedValue({});
  
  await controller.importar(req, res);
  
  expect(axios.post).toHaveBeenCalledWith(
    'http://callback.com',
    expect.objectContaining({ nome: 'João' })
  );
});
```

## Matriz de Testes por Módulo

| Módulo | Tipo | Cobertura | Status |
|--------|------|-----------|--------|
| alunoController | Unitário | ✅ 100% | ✅ Feito |
| Aluno Model | Validação | ⏳ 50% | ⏳ Em progresso |
| documentService | Unitário | ⏳ 50% | ⏳ Em progresso |
| Routes | Integração | 🚫 0% | 🚫 Não iniciado |

## Próximos Passos

### 1. Expandir Testes
```bash
npm run test:coverage
```
Identifique linhas não cobertas e adicione testes.

### 2. Adicionar Testes de Autenticação
```javascript
// src/middlewares/__tests__/authMiddleware.test.js
describe('authMiddleware', () => {
  it('deve rechazar token inválido', () => { });
  it('deve aceitar token válido', () => { });
});
```

### 3. Testes e2e (Final-to-End)
```javascript
// Se quiser testa toda a aplicação, instale:
npm install --save-dev supertest

// E crie testes como:
const request = require('supertest');
describe('Full API', () => {
  it('fluxo completo: register -> login -> criar aluno', () => { });
});
```

### 4. CI/CD Integration
Adicione ao `package.json`:
```json
"test:ci": "jest --coverage --ci --forceExit --testTimeout=10000"
```

## Troubleshooting

### Erro: "Cannot find module"
```bash
# Verificar se jest.config.js está na raiz
# Verificar paths nos imports dos testes
```

### Erro: "Timeout"
```javascript
jest.setTimeout(10000); // Aumentar timeout
// ou no jest.config.js
testTimeout: 10000
```

### Mock não funcionando
```javascript
// Certifique-se de chamar jest.mock() ANTES de require()
jest.mock('../../models/Aluno');
const Aluno = require('../../models/Aluno');
```

## Recursos Úteis

- [Jest Docs](https://jestjs.io/)
- [Jest Mock Patterns](https://jestjs.io/docs/manual-mocks)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Resumo Rápido

1. **Escreva testes enquanto codifica**
2. **Mantenha testes simples e focados**
3. **Use mocks para dependências externas**
4. **Teste casos de sucesso E erro**
5. **Aim for 80%+ coverage**
6. **Execute antes de fazer commit**

```bash
# Comando magic para verificar tudo
npm test && npm run test:coverage
```
