class EntidadeBibliografica {
    //Construtor da classe EntidadeBibliografica com propriedades básicas

    constructor(titulo, autor, anoPublicacao, codigo) {
        this.titulo = titulo;
        this.autor = autor;
        this.anoPublicacao = anoPublicacao;
        this.codigo = codigo;
        this.emprestado = false; //Indica se um livro está disponivel ou não.
        this.usuarioEmprestimo = null; // Armazena o usuário que está em posse do livro.
    }

    // Função para emprestar o item para um usuário, recebe como parâmetro o usuario. Se o livro estiver disponivel, altera as propriedades basicas do item, marcando-o como não disponivel e armazena o usuario que realizou o emprestimo. Caso contrário, exibe uma mensagem que indica que o livro não está disponivel para emprestimo.
    emprestar(usuario) {
        if (this.emprestado) {
            console.log("O livro não está disponível")
        } else {
            this.emprestado = true;
            this.usuarioEmprestimo = usuario;
            console.log(`${this.titulo} emprestado para ${usuario.nome}`);
        }
    }

    //Função para devolver o item, marcando-o como disponível e limpando usuario que realizou o emprestimo. Caso o livro não esteja emprestado, ou seja diferente de true, é exibida uma mensagem que indica a disponilidade do livro, caso contario o buffer do usuario é limpo e o emprestimo passa a ser falso.
    devolver() {
        if (!this.emprestado) {
            console.log("O livro está disponível")
        } else {
            this.emprestado = false;
            this.usuarioEmprestimo = null;
            console.log(`${this.titulo} foi devolvido`);
        }
    }
}

class Usuario {
    // Construtor da classe Usuario, iniciando com propriedades básicas.
    constructor(nome, registroAcademico, dataNascimento) {
        this.nome = nome;
        this.registroAcademico = registroAcademico;
        this.dataNascimento = dataNascimento;
    }
}

// Genero Livro recebe parametros
const generoLivro = {
    FICCAO: "Ficção Ciêntifica",
    ACAO: "Ação",
    SUSPENSE: "Suspense",
    TERROR: "Terror",
    COMEDIA: "Comedia",
    DRAMA: "Drama",
    ROMANCE: "Romance",
    AVENTURA: "Aventura",
    FANTASIA: "Fantasia",
    TECH: "Desenvolvimento de Software"
};

// enumerados, genero livro recebe alguns tipos de generos

class Revista extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, edicao) {
        super(titulo, autor, anoPublicacao, codigo)
        this.edicao = edicao;
    }

    getInformacoes() {
        return `NOME: ${this.titulo}, EDIÇÃO: ${this.edicao}`;
    }
}

class Livro extends EntidadeBibliografica {
    constructor(titulo, autor, anoPublicacao, codigo, genero) {
        super(titulo, autor, anoPublicacao, codigo)
        // super chama a classe pai e os parametros do construtor 
        this.genero = genero;
        // Inserindo o genero na classe Livro.
    }
    getInformacoes() {
        return `NOME: ${this.titulo}, GENERO: ${this.genero}`;
    }
}

class Biblioteca {
    // Construtor da Biblioteca, inicializa os arrays acervo e usuarios.
    constructor() {
        this.acervo = []
        this.usuarios = []

    }
    //Acervo que vem da API convertido em JS Object
    iniciarAcervo(acervo) {
        // this.acervo = [];
        acervo.forEach(item => {
            if (item.entidadeBibliografica === "Livro") {
                // Criando um novo objeto Livro e adicionando ao Acervo
                const livroObj = new Livro(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.genero);
                this.acervo.push(livroObj)
            }
            else if (item.entidadeBibliografica === "Revista") {
                // Criando um novo objeto Revista e adicionando ao Acervo
                const revistaObj = new Revista(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.edicao);
                this.acervo.push(revistaObj)
            }
        })
    }

    // Função para adicionar um item ao acervo da biblioteca, recebe como parametro o item e realiza o push do mesmo no array acervo.
    adicionarItem(item) {
        this.acervo.push(item)
    }

    /*Função para listar o acervo, caso o tamanho do acervo seja igual a zero retorna um console.log indicando que o acervo está vazio, caso contrário, utilizando o forEach percorre cada elemento do array com callback definido utilizando um arrow function. Em seguida, cria uma string dataUsuario que recebe uma condicional ternária que atribui a dataUsuario: true se o item estiver emprestado ou false se o item estiver disponível. Por fim, dataUsuario imprime o valor da condicional ternária que foi satisfeita.*/
    listarAcervo() {
        if (this.acervo.length === 0) {
            console.log("O acervo está vazio");
        } else {
            this.acervo.forEach(item => {
                const dataUsuario = item.usuarioEmprestimo ? `Emprestado para ${item.usuarioEmprestimo.nome}` : `Disponível`;
                console.log(`${item.titulo} - ${dataUsuario}`);
                //todo imprimir o getInformações
            })
        }

    }

    // Função para adicionar um usuário à lista de usuários da biblioteca, recebe como parametro um user e da realiza o push do mesmo no array de usuarios.
    adicionarUser(user) {
        this.usuarios.push(user)
    }

    //Função que faz a chamada da API de Usuarios. todo
    async inicializarUsuarios() {
        try {
            const usuariosAPI = await obterDataAPIUsuarios();
            usuariosAPI.forEach(user => {
                const usuarioObj = new Usuario(user.nome, user.registroAcademico, user.dataNascimento);
                this.adicionarUser(usuarioObj);
            });
        } catch (erro) {
            console.error("Erro ao inicializar usuários", erro);
        }
    }
    //Funçao que faz a listagem de usuarios lidos da API
    listarUsuarios() {
        if (this.usuarios.length === 0) {
            console.log("Não há usuários cadastrados na biblioteca");
        } else {
            this.usuarios.forEach(user => {
                console.log(`${user.nome} - ID: ${user.registroAcademico}`);
            });
        }
    }

    // Função para emprestar um item do acervo para um usuário, recebe o codigo e o usuario como parametro, realiza a busca do código e caso seja encontrado chama a função emprestar da Entidade Bibliografica
    emprestarItem(cod, usuario) {
        //Verifica se o usuario existe
        const usuarioEncontrado = this.usuarios.find((user) => user === usuario);
        //Caso o usuario não exista há um retorno
        if (!usuarioEncontrado) {
            console.log("Usuário não encontrado no sistema.");
            return;
        }
        //Caso o usuario exista, em seguida é feita a validação do código
        const found = this.acervo.find((element) => element.codigo === cod);
        //Se o código for encontrado, valida-se a disponibilidade do item, caso não esteja disponivel é exibida a mensagem no console, caso esteja disponivel é chamada a funçao emprestar que recebe como parametro o usuario. Caso o código não seja encontrado é exibido no console.
        if (found) {
            if (found.emprestado) {
                console.log(`${found.titulo} não está disponível`)
                criarPopup(`${found.titulo} não está disponível`) //TODO
            } else {
                found.emprestar(usuario);
                criarPopup("Empréstimo realizado com sucesso.")
            }
        } else {
            console.log("Não foi possível encontrar o código!");
            criarPopup("Não foi possível encontrar o código.")
        }
    }

    // Função para devolução de um livro, recebe o codigo como parametro, realiza a busca do código e verifica se o mesmo existe, caso seja encontrado chama a função devolver da Entidade Bibliografica, ao contrário é exibido no console uma mensagem que indica que o código nao foi encontrado.
    devolverItem(cod) {
        const found = this.acervo.find((element) => element.codigo === cod);

        if (found) {
            found.devolver();
            criarPopup("Devolução realizada com sucesso.")
        } else {
            console.log("Não foi possível encontrar o código!");
            criarPopup("Não foi possível encontrar o código.")
        }
    }
}