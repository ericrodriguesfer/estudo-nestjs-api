<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

# PROJETO DE ESTUDO DE NESTJS

##### Projeto em desenvolvimento...

## SAIBA MAIS SOBRE O PROJETO

Esse projeto consiste em um estudo e aprofundamento prático de NestJs, esse projeto inicialmente era o estudo baseado somente no que a documentação no NestJs oferece **[Doc NestJs](https://docs.nestjs.com/)**, onde basicamente foi ensinado a utilizar o básico dos recursos do NestJs com o banco de dados não relacional MongoDB, mas sem aplicar as melhores práticas que o NestJs prega, com isso resolvi pegar o mesmo projeto e o atualizar para um novo propósito, o anterior era basicamente um projeto onde um dono (owner) podia se cadastrar, e com isso ele podia cadastrar seus pets que em geral eram gatos, e listas todos os seus gatos e os atualizar de forma individual, para esse novo projeto foi reestruturado o mesmo completamente desde a estrutura arquitetural do projeto em si, até o banco de dados e o ORM que seria utilizado, hoje o projeto já tem a possibilidade de permitir o cadastro de um usuário na plataforma, o login do mesmo, e atualização do perfil do mesmo, o próximo passo será implementar o módulo de pets, onde permitirá o cadastro de vários pets, e posterior a isso, o módulo de finanças, onde vai permitir cadastrar os gastos tidos com cada pet, para favorecer a possibilidade de criação de estatísticas como: pet que mais gasta, a média de gasto com os pets por períodos e etc, sendo isso o último passo deste projeto de estudo.

## ROADMAP

- [x] Ajustar a estrutura do projeto para o padrão Nest com TypeORM
- [x] Integrar TypeORM ao projeto
- [x] Integrar o TypeORM ao PostgreSQL
- [x] Containerizar o banco de dados PostgreSQL do projeto com Docker (docker-compose)
- [x] Criar e implementar os módulos de Usuário e Autenticação
- [x] Implementar a autenticação do usuário
- [x] Implementar a interceptação de rotas mediante login/auth feito
- [x] Implementar envio de e-mail mediante algumas ações como: cadastro na plataforma, requisição de token para recuperação de senha e redefinição de senha feita com sucesso
- [ ] Criar e implementar o módulo de Pets
- [ ] Criar e implementar o módulo de Finança

## TECNOLOGIAS QUE FORAM UTILIZADAS NO PROJETO
* NodeJs
* ExpressJs
* NestJs
* TypeORM
* Docker
* SendGrid
* PostgreSQL
* Jwt
* Date fns
* BCrypt
* Class Transformer e Class Validator
* Entre outros

## CASO QUEIRA SABER MAIS SOBRE O PROJETO

Pode entrar em contato comigo pelo seguinte email: ericdesenvolvedor7@gmail.com
