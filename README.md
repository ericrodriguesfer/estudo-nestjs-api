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
- [x] Implementar envio de e-mail mediante algumas ações como: cadastro de novo usuário na plataforma, requisição de token para recuperação de senha e redefinição de senha feita com sucesso
- [x] Documentar o projeto ao menos de forma básica com [Swagger](https://swagger.io/)
- [ ] Criar e implementar o módulo de Pets
- [ ] Criar e implementar o módulo de Finança
- [ ] Melhorar a documentação do [Swagger](https://swagger.io/) ajustando a parte de auth na documentação do projeto

## FEATURES

* Usuário

  * Se cadastrar na plataforma
    * **OBS:** *É enviado um email para o email de registro deste dado usuário informando/confirmando que ele se registrou na plataforma*
  * Atualizar os próprios dados
  * Solicitar a listagem de seus dados
  * Logar na plataforma/Criar uma sessão de acesso
  * Solicitar a recuperação de senha:

    * Solicitar o envio de um token para recuperação
      * **OBS:** *É enviado um email para o email de registro deste dado usuário contendo o token que ele usará para redefinir sua senha perdida*
    * Alterar sua senha com o token em posse
      * **OBS:** *É enviado um email para o email de registro deste dado usuário informando/confirmando que a senha dele foi redefinida com sucesso*

## OBSERVAÇÕES DO PROJETO

O projeto possui duas formas de envio de e-mail, uma utilizando o [SendGrid](https://sendgrid.com/) uma plataforma/ferramenta de envio de email da [Twilio](https://www.twilio.com/pt-br/), por ser um serviço a questão do envio de e-mails com a mesma é mais fácil e rápida de "configurar", sendo feita algumas poucas configurações dentro da plataforma mesmo da ferramenta, como criação do template que será utilizado no envio de e-mail (existe inúmeros modelos prontos), o cadastro na plataforma do e-mail que será o responsável ou o enviante dos e-mails e a obtenção de uma key de uso do pŕoprio SendGrid, no projeto em si, a configuração basicamente é importar o módulo do SendGrid ao projeto e passar ao mesmo a key que foi obtida na plataforma, pois é ela quem valida tudo que está configurado na plataforma como e-mails cadastrados como *senders* e os templates que serão utilizados.

A outra forma de enviar e-mail foi a última configurada no projeto e a que está em uso no momento, que é o envio de e-mails com o [NodeMailer](https://nodemailer.com/about/), que basicamente é um módulo do NodeJs que permite realizar o envio de e-mails, neste cenário é um pouco mais complexto de configurar do que o com uso do SendGrid, mas particularmente, gostei mais deste com o NodeMailer, como ele é totalmente configurado no projeto via código mesmo, deste a integração com um serviço SMTP de envio de e-mail, login no e-mail que será o enviante dos e-mails do projeto/plataforma, como a criação dos modelos/templates que serão utilizandos para enviar os e-mails, neste caso foi utilizado o [Handlebars](https://handlebarsjs.com/) em conjunto com CSS para enviar um e-mail estilizado que seja mais bonito e agradável ao usuário, neste caso deste projeto seguindo os padrões do NestJs implementei um módulo apenas para isso, configuração e envio de e-mails, módulo esse que pode ser usado pelos demais módulos do projeto/aplicação, e por ser algo totalmente configurado no projeto, temos mais domínio e controle para o alterar como melhor desejarmos e necessitarmos para o projeto.

E um grande diferencial do NodeMailer ao SendGrid é que o mesmo é gratuito, o SendGrid é um serviço pago com uma cota de uso gratuita que limita um total de envios de e-mails diários e passado o limite máximo gratuito de envios, para continuar usando o mesmo terá que ser adquirido o seriviço, o NodeMailer nesse ponto e ilimitado e totalmente configurável e customizável.

## TECNOLOGIAS QUE FORAM UTILIZADAS NO PROJETO
* NodeJs
* ExpressJs
* NestJs
* TypeORM
* Docker
* SendGrid
* NodeMailer
* Handlebars
* PostgreSQL
* Jwt
* Swagger
* Date fns
* BCrypt
* Class Transformer e Class Validator
* Entre outros

## CASO QUEIRA SABER MAIS SOBRE O PROJETO

Pode entrar em contato comigo pelo seguinte email: ericdesenvolvedor7@gmail.com
