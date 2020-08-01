# Desafio Sigalei

Este projeto foi criado para o Desafio Sigalei e tem como objetivo mostrar alguns dados sobre os commits no repositório
do Linux, foi utilizado no projeto, typescript, relay e react.

Baixe mais commits do repositório para atualizar os gráficos utilizando o botão no fim página e se tiver interesse
em ver informações dos commits de cada usuário utilize o path /commits?user=username sendo o username o nome do usuário
a ser buscado ou clique nas barras do histograma para ir diretamente para o usuário em questão.

## Para rodar

Segue os passos necessários para rodar o site localmente.

Crie uma variável de ambiente chamada REACT_APP_GITHUB_PRIVATE_KEY com l seu [token do github](https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token) pode ser feito pelo [terminal](https://www.schrodinger.com/kb/1842) ou criando um arquivo .env na raiz do projeto.

Instale as dependências.

```
yarn
```

Gere o código necessário para o relay

```
yarn relay
```

Rode o servidor.

```
yarn start
```

Após terminar de compilar e abrir seu site estará rodando no link [http://localhost:3000](http://localhost:3000).

## Feito com

- [React](https://reactjs.org/) - Biblioteca em JavaScript usada para a interface.
- [Relay](https://relay.dev/) - Usado para fazer queries de GraphQL.
- [Material-UI](https://material-ui.com/) - Usado para uma interface mais bonita.
- [Typescript](https://www.typescriptlang.org/) - Linguagem utilizada para facilitar a escalabilidade.

## Autores

- **Rodrigo Geurgas** - [rgeurgas](https://github.com/rgeurgas)

## License

Este projeto utiliza a licença do MIT - veja [LICENSE.md](LICENSE.md) para detalhes
