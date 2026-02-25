# 📚 Documentação Técnica — Serviço para controle de alunos
# Stack obrigatória
# Backend -> Node.js - Express 
# Frontend -> VueJS 3 


## 1. Visão Geral

A plataforma permite que **instituições de ensino**:

- Criem uma conta
- Importem dados de alunos via JSON
- Validem os dados contra um `JSON Schema`
- Gerem um identificador/hash único por aluno
- Gerem um arquivo (xml) para exportação e uso como documento de comprovação em instituições externa
- Notifiquem o aluno via webhook
- Permitam consulta posterior via URL pública

---

# 2. Arquitetura Funcional

## Principais Módulos

**Autenticação**
**Dashboard da Instituição**
**Importação de Alunos (JSON)**
**Validação via JSON Schema**
**Persistência e Edição**
**Geração de Hash**
**Geração de Arquivo**
**Webhook de Notificação**
**Consulta Pública**
**Soft Delete**

---

# 3. Fluxo Macro do Sistema

## 3.1 Autenticação

**Entrada:**

- Login
- Cadastro

**Saída:**

- Token JWT (ou sessão autenticada)

**Requisitos técnicos:**

- Hash de senha com bcrypt/argon2
- JWT com expiração
- Multi-tenant (cada instituição só acessa seus dados)

---

## 3.2 Dashboard da Instituição

Após autenticação:
Exibe:
- Nome da instituição
- Listagem de alunos
- Status de cada aluno
- Ações disponíveis

---

# 4. Importação de Alunos

## 4.1 Endpoint

```
POST /api/alunos/import
Content-Type: application/json
Authorization: Bearer <token>
```

# 5. Validação via JSON Schema

### Requisito obrigatório:

Toda importação deve ser validada contra um `JSON Schema`.

## 5.1 Regras

- Campos obrigatórios
- Formato correto 
- CPF válido (validação adicional)
- Tamanho mínimo/máximo
- Tipos corretos

## 5.2 Resultado da Validação

### Se inválido:

- Retornar:
    

```json
{
  "status": "error",
  "erros": [
    {
      "campo": "cpf",
      "motivo": "CPF inválido"
    }
  ]
}
```

### Se válido:

- Persistir dados

---

# 6. Persistência

## Regras

- Cada aluno pertence a uma instituição (FK)
- Não permitir duplicidade lógica (ex: CPF + curso + dataConclusao)
- Versionamento opcional (boa prática)

---

# 7. Ações Disponíveis no Dashboard

Para cada aluno:

-  Visualizar dados
-  Editar dados
- Cancelar
---

# 8. Soft Delete - Cancelar

Não remover fisicamente do banco.

# 9. Geração de Hash

## Objetivo

Criar um identificador único e verificável para o aluno.

### Requisitos:

- Hash imutável após geração

Persistir:

```
hash
```

# 10. Geração de Arquivo (xml)

Após geração do hash:

- Criar arquivo com:
    
    - Dados do aluno
    - Código de validação
- Armazenar:
    - Localmente


Persistir:

```
file_path
```

---

# 11. Webhook para Notificação

## Objetivo

Notificar o aluno quando o código de validação for gerado.
Cada aluno tem a seu metodo de notificação, o exemplo abaixo demonstra como deve ser o uso de webhooks
## Payload enviado

```
POST webhook_url

{
  "nome": "...",
  "cpf": "...",
  "validation_code": "...",
  "url_consulta": "...",
  "hash": "..."
}
```


url_consulta é a url para a tela de consulta dos dados do aluno + download do xml gerado
url_consulta: <host>/validar/:hash
---

# 12. Consulta Pública

## Endpoint

```
GET /validar/:hash
```

## Comportamento

- Buscar aluno pelo hash
    
- Verificar se:
    - Não está deletado
    - Não está cancelado
- Exibir:
    - Dados públicos
    - Link para download do arquivo

---

# 13. Regras de Negócio Críticas

1. Cada instituição gerencia seus próprios alunos.
2. Não permitir importação se JSON inválido.
3. Não permitir gerar hash duas vezes (idempotência).
4. Hash nunca pode ser alterado após geração.

---

# 14. Modelo de Dados (BÁSICO) 

A modelagem fica por sua conta, adicione os campos que forem necessários para a sua solução!
Este é apenas um exemplo de campos que são essenciais.
## Instituicao

```
id
nome
email
senha_hash
created_at
```

## Aluno

```
id
nome
cpf
dt_nascimento
curso
status
hash
file_path
deleted_at
created_at
```


##Curso
id
nome
dt_inicio
dt_fim
docente



## Você deve notificar o Aluno de alguma forma que o "Certificado de conclusão(XML)" dele foi gerado e pode ser consultado! Você tem total liberdade para definir a forma de notificação(Email, webhook, Mensagem, notificação, Alerta. etc...) você pode implementar 1 ou N maneiras de notificar.



## Desafios plus - Geral
- Separar back e front em containers isolados
- Codigo organizado e com responsabilidades bem divididas
- Nomeação e importação organizada de modulos e variaveis


## Desafios plus - Backend
- Criar a esteira de CI/CD, automação de build
- Auditoria
- Validações customizaveis por cliente(Cliente cria sua validação - schema)
= Notificações em tempo real(websockets)
= Gracefull shutdown
= Cluster module


## Desafios plus - Frontend
- Gerenciamento de contexto global
- Mais de uma forma de autenticação, JWT é basico
- Nginx para proxy reverso
- Hierarquia de componentes organizada