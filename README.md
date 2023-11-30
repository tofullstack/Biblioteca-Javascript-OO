<h1>Biblioteca</h1>
Sistema de Biblioteca em JavaScript

<p>Este exercício tem como objetivo praticar a programação orientada a objetos, trabalhando com classes, herança, e interação entre objetos.</p>

<details>
  <summary>Parte 1</summary>
  <p>
    Crie uma classe base chamada EntidadeBibliografica com os seguintes atributos:
    <ul>
      <li>titulo</li>
      <li>autor</li>
      <li>anoPublicacao</li>
      <li>codigo</li>
      <li>emprestado: booleano</li>
      <li>usuarioEmprestimo: Referência ao usuário que pegou emprestado (pode ser null se não estiver emprestado)</li>
    </ul>
    Crie duas subclasses de EntidadeBibliografica: Livro e Revista. A classe Livro deve ter um atributo adicional chamado genero.
    Implemente os métodos emprestar e devolver na classe EntidadeBibliografica. O método emprestar deve atribuir o usuário que está pegando emprestado e definir emprestado como true. O método devolver deve resetar o status de empréstimo e desatribuir o usuário.
    Crie uma classe Usuario com os seguintes atributos:
    <ul>
      <li>nome</li>
      <li>registroAcademico</li>
      <li>dataNascimento (no formato "YYYY-MM-DD") ex. (1995-12-25)</li>
    </ul>
  </p>
</details>
<details>
    <summary>Parte 2</summary>
  <p>Crie uma classe Biblioteca com os seguintes atributos:</p>
  <ul>
    <li>acervo: array para armazenar as entidades bibliográficas</li>
    <li>usuarios: array para armazenar os usuários</li>
  </ul>
  <p>Implemente os seguintes métodos na classe Biblioteca:</p>
  <ul>
    <li>adicionarItem(item): Adiciona uma entidade bibliográfica ao acervo.</li>
    <li>listarAcervo(): Exibe o acervo da biblioteca.</li>
    <li>adicionarUsuario(usuario): Adiciona um usuário à biblioteca.</li>
    <li>emprestarItem(codigo, registroAcademico): Empréstimo de um item para um usuário.</li>
    <li>devolverItem(codigo): Devolução de um item ao acervo.</li>
  </ul>
</details>
