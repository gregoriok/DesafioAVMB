FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código-fonte
COPY . .

# Expor a porta (ajuste conforme necessário)
EXPOSE 3000

# Comando para iniciar o servidor
CMD ["npm", "start"]
