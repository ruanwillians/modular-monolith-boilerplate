# Estágio 1: Builder - Onde a aplicação é compilada
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Copia os arquivos de dependências e instala
# Usamos --frozen-lockfile para garantir builds reprodutíveis
COPY package*.json ./
COPY apps/core-app/prisma ./prisma

RUN npm install --frozen-lockfile

# Copia todo o código-fonte do monorepo para o contêiner
COPY . .

# Constrói a aplicação 'adapter'
RUN npm run build:adapter

# Estágio 2: Runner - Imagem final, otimizada e leve
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia as dependências de produção e o código compilado do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

COPY --from=builder /usr/src/app/prisma ./prisma

# Expõe a porta que a aplicação vai usar
EXPOSE 3002

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/apps/adapter/main.js"]