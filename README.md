# 🚀 Desafio Fullstack - Sistema de Gerenciamento

### 📝 Descrição
Este projeto é uma aplicação completa (Fullstack) desenvolvida para o desafio técnico da **AVMB**. O sistema consiste em uma API robusta em Node.js, uma interface interativa em Angular e persistência de dados em MySQL. A arquitetura foi totalmente containerizada com Docker para garantir que o ambiente rode de forma idêntica em qualquer máquina.

**Principais funcionalidades:**
* Autenticação de usuários via JWT (JSON Web Token).
* Gerenciamento de instituições e documentos.
* Upload de arquivos salvos localmente no servidor.
* Ambiente orquestrado para deploy rápido.

---

### 🛠️ Tecnologias Utilizadas

* **Backend:** Node.js, Express, Sequelize/MySQL2, JWT.
* **Frontend:** Vue.
* **Banco de Dados:** MySQL.
* **Infraestrutura:** Docker e Docker Compose.

---

### 🏃 Como Rodar o Projeto

Você não precisa instalar Node.js ou MySQL localmente, apenas ter o **Docker** e o **Docker Compose** instalados.

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/gregoriok/DesafioAVMB.git]
    cd DesafioAVMB
    ```

2.  **Configuração do Ambiente:**
    O projeto utiliza variáveis de ambiente para segurança. Certifique-se de que o serviço `backend` no arquivo `docker-compose.yml` possua a variável `JWT_SECRET` definida.

3.  **Inicie a aplicação:**
    Na raiz do projeto, execute o comando:
    ```bash
    docker-compose up -d --build
    ```
    *Este comando irá baixar as imagens, criar a rede interna, configurar o banco de dados e subir os serviços de front e backend.*

4.  **Acesse no navegador:**
    - **Frontend:** [http://localhost:80](http://localhost:80)
    - **API Backend:** [http://localhost:3000](http://localhost:3000)

---

### 📂 Estrutura de Pastas

```text
.
├── backend/
│   ├── src/
│   │   ├── controllers/  # Lógica de rotas e requisições
│   │   ├── services/     # Regras de negócio (ex: authService.js)
|   |   ├── middlewares/  # Regras de validações(ex: jsonschema)
│   │   ├── routes/       # Definição dos endpoints
│   │   └── server.js     # Inicialização do servidor
│   └── Dockerfile        # Configuração da imagem Node.js
├── frontend/
│   ├── src/              # Componentes e serviços Angular
│   └── Dockerfile        # Configuração da imagem com Nginx
└── docker-compose.yml    # Orquestração MySQL, API e Web

```

### Projeto Possui Testes automatizados gerados com auxilio de IA
