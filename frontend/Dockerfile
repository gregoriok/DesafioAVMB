FROM node:18-alpine as build

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar o código-fonte
COPY . .

# Build da aplicação
RUN npm run build

# Stage final - servidor Nginx para servir arquivos estáticos
FROM nginx:alpine

# Copiar arquivos construídos do build anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copiar configuração nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
