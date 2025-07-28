# Estágio 1: Builder - Onde a aplicação é compilada
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Otimização de cache do Docker:
# 1. Copia os arquivos de dependência e o schema do Prisma
COPY package*.json ./
COPY apps/core-app/prisma ./prisma

# 2. Instala as dependências. O `prisma generate` será executado automaticamente
#    pelo pacote @prisma/client. Esta camada será cacheada se os arquivos acima não mudarem.
RUN npm install --frozen-lockfile

# 3. Copia o resto do código-fonte
COPY . .

# Constrói a aplicação 'core-app'
RUN npm run build:core-app

# Estágio 2: Runner - Imagem final, otimizada e leve
FROM node:20-alpine

WORKDIR /usr/src/app

# Copia as dependências de produção e o código compilado do estágio 'builder'
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# O Prisma Client precisa do schema para localizar o query engine em tempo de execução
COPY --from=builder /usr/src/app/prisma ./prisma

# Expõe a porta que a aplicação vai usar
EXPOSE 3001

# Comando para iniciar a aplicação em produção
CMD ["node", "dist/apps/core-app/main.js"]