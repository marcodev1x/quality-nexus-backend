FROM node:18

# Diretório de trabalho dentro do container
WORKDIR /app

# Copiar arquivos
COPY package.json yarn.lock ./
RUN yarn install

# Copiar o restante do projeto
COPY . .

# Comando padrão (caso rode fora do dev)
CMD ["yarn", "dev"]