# Quality Nexus - Backend

### Como rodar o projeto?

1. Clone o repositório:
   ```git clone {url}```
2. Acesse a pasta do projeto;
3. Utilize o yarn para instalar as dependências:
   ```yarn install```
4. Crie um arquivo `.env` na raiz do projeto com as variáveis de ambiente necessárias. Você pode usar o arquivo
   `.env.example` como referência.
5. Utilize `yarn dev` para rodar o projeto em modo de desenvolvimento.

### Características do projeto

- **Estrutura de pastas**: O projeto é organizado em pastas para facilitar a navegação e manutenção do código.
- **Tecnologias**: O projeto utiliza Express.js como framework web e Knex.JS para interagir com o banco de dados. O
  projeto utiliza também o TypeScript para garantir a tipagem estática do código.
- **Banco de dados**: O projeto utiliza o MySQL como banco de dados padrão.
- **Migrations**: O projeto utiliza migrations para gerenciar as alterações no banco de dados. As migrations são
  armazenadas na pasta
  `migrations` e podem ser executadas com o comando `yarn migrate`.