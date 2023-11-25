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
}

class Biblioteca {
    // Construtor da Biblioteca, inicializa os arrays acervo e usuarios.
    constructor() {
        this.acervo = []
        this.usuarios = []

    }

    iniciarAcervo(acervo) {
        // this.acervo = [];
        acervo.forEach(item => {
            if (item.entidadeBibliografica == "Livro") {
                // Criando um novo objeto Livro e adicionando ao Acervo
                const livroObj = new Livro(item.titulo, item.autor, item.anoPublicacao, item.codigo, item.genero);
                this.acervo.push(livroObj)
            }
            else if (item.entidadeBibliografica == "Revista") {
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
            } else {
                found.emprestar(usuario);
            }
        } else {
            console.log("Não foi possível encontrar o código!");
        }
    }

    // Função para devolução de um livro, recebe o codigo como parametro, realiza a busca do código e verifica se o mesmo existe, caso seja encontrado chama a função devolver da Entidade Bibliografica, ao contrário é exibido no consoel uma mensagem que indica que o código nao foi encontrado.
    devolverItem(cod) {
        const found = this.acervo.find((element) => element.codigo === cod);

        if (found) {
            found.devolver();
        } else {
            console.log("Não foi possível encontrar o código!");
        }
    }
}


//Função que fará a chamada da API do Acervo e armazenará o conteudo da mesma.

async function obterDataAPI() {
    try {
        /*Armazena a API em uma constante inicial chamada apiURL, em seguida uma segunda constante nomeada response é iniciada recebendo um await fetch que recebe como parametro a constante inicial apiURL. Depois, uma terceira constante é criada com o nome de data que recebe um await response.json() -> a constante Data armazena a conversao para JSON dos aquivos recebidos da API, ao final é retornado a Data ou um array vazio. */

        const apiURL = `https://api-biblioteca-mb6w.onrender.com/acervo`
        const response = await fetch(apiURL);
        const data = await response.json();
        return data || []
        // se exister data retorna a mesma, caso não, retorna um array vazio

    } catch (erro) {
        console.error("Erro na chamada da API")
        return [] // retorna um array vazio 
        //todo ? return array vazio? necessario?
    }
    /*Caso ocorra um erro na chamada da API, um console.error é exibido indicando o problema e retorna um array vazio*/
}
/*Função que fará a chamada da API de Usuarios e armazenará o conteudo da mesma. todo */
async function obterDataAPIUsuarios() {
    try {
        const apiURL = `https://api-biblioteca-mb6w.onrender.com/users`;
        const response = await fetch(apiURL);
        const data = await response.json();
        return data || [];
    } catch (erro) {
        console.error("Erro na chamada da API de usuários");
        return [];
    }
}


/*Função que realiza a inicialização da biblioteca.*/
async function inicializarBiblioteca() {
    try {
        /*Uma constante chamada acervoAPI recebe um await da function obterDataAPI (que retorna a Data), utiliza a constante global novaBiblioteca e faz a chamada das funções iniciarAcervo e listarAcervo que exibirá o nome do item e sua disponibilidade. Caso ocorra um erro na inicialização da biblioteca, o erro é exibido em um console.error */
        const acervoAPI = await obterDataAPI();
        novaBiblioteca.iniciarAcervo(acervoAPI);
        novaBiblioteca.listarAcervo(); //dados lidos da API
        // console.log("Dados obtidos da API:", acervoAPI); //teste de verificação dos dados da API

        await novaBiblioteca.inicializarUsuarios();
        novaBiblioteca.listarUsuarios();
    } catch (erro) {
        console.error("Erro ao inicializar a biblioteca", erro)
    }
}
//Iniciando uma constante nomeada novaBiblioteca que recebe um objeto do tipo Biblioteca
const novaBiblioteca = new Biblioteca();
//Chamada da funçao que inicia a biblioteca
inicializarBiblioteca();


// Testes de funcionalidade do código


document.addEventListener('DOMContentLoaded', async function () {
    const novaBiblioteca = new Biblioteca();

    async function obterDadosAPIAcervo() {
        try {
            const apiURL = `https://api-biblioteca-mb6w.onrender.com/acervo`;
            const response = await fetch(apiURL);
            const data = await response.json();
            return data || [];
        } catch (erro) {
            console.error("Erro na chamada da API de acervo");
            return [];
        }
    }

    async function obterDadosAPIUsuarios() {
        try {
            const apiURL = `https://api-biblioteca-mb6w.onrender.com/users`;
            const response = await fetch(apiURL);
            const data = await response.json();
            return data || [];
        } catch (erro) {
            console.error("Erro na chamada da API de usuários");
            return [];
        }
    }

    async function inicializarBiblioteca() {
        try {
            const acervoAPI = await obterDadosAPIAcervo();
            const usuariosAPI = await obterDadosAPIUsuarios();

            novaBiblioteca.iniciarAcervo(acervoAPI);
            novaBiblioteca.usuarios = usuariosAPI;

            novaBiblioteca.listarAcervo();
            novaBiblioteca.listarUsuarios();
        } catch (erro) {
            console.error("Erro ao inicializar a biblioteca", erro);
        }
    }

    await inicializarBiblioteca();
});

function adicionarUsuario() {
    const nome = document.getElementById('nomeUsuario').value;
    const registroAcademico = document.getElementById('registroUsuario').value;
    const dataNascimento = document.getElementById('dataNascimentoUsuario').value;

    if  (nome.length === 0 || registroAcademico.length === 0 || dataNascimento.length === 0) {
        alert('Por favor, preencha todos os campos antes de adicionar o usuário.');
        return; // irá sair da funçao aqui caso algum campo estiver vazio
    }

    const novoUsuario = new Usuario(nome, registroAcademico, dataNascimento, novaBiblioteca.usuarios.length + 1);
    novaBiblioteca.adicionarUser(novoUsuario);

    document.getElementById('nomeUsuario').value = '';
    document.getElementById('registroUsuario').value = '';
    document.getElementById('dataNascimentoUsuario').value = '';

    alert('Usuário adicionado com sucesso!');
}

function adicionarItem() {
    const titulo = document.getElementById('tituloItem').value;
        const autor = document.getElementById('autorItem').value;
        const anoPublicacao = document.getElementById('anoPublicacaoItem').value;
        const codigo = document.getElementById('codigoItem').value;
        const genero = document.getElementById('generoItem').value;

        if (titulo.length === 0 || codigo.length === 0) {
            alert('Por favor, preencha todos os campos antes de adicionar o item');
            return; // irá sair da funçao aqui caso algum campo estiver vazio
        }

        const novoItem = new Livro(titulo, autor, anoPublicacao, codigo, genero);
        novaBiblioteca.adicionarItem(novoItem);

        document.getElementById('tituloItem').value = '';
        document.getElementById('autorItem').value = '';
        document.getElementById('anoPublicacaoItem').value = '';
        document.getElementById('codigoItem').value = '';

        alert('Item adicionado ao acervo com sucesso!');
}

function listarUsuarios() {
    const listaUsuarios = document.getElementById('listaUsuarios');
    listaUsuarios.innerHTML = '';

    novaBiblioteca.usuarios.forEach(usuario => {
        const li = document.createElement('li');
        li.textContent = `${usuario.nome} - ID: ${usuario.registroAcademico}`;
        listaUsuarios.appendChild(li);
    });
}

function listarAcervo() {
    const listaAcervo = document.getElementById('listaAcervo');
    listaAcervo.innerHTML = '';

    novaBiblioteca.acervo.forEach(item => {
        const li = document.createElement('li');
        const status = item.emprestado ? `Emprestado para ${item.usuarioEmprestimo.nome}` : 'Disponível';
        li.textContent = `${item.titulo} - ${status} - COD: ${item.codigo}`;
        listaAcervo.appendChild(li);
    });
}
function emprestarItem() {
    const codigo = document.getElementById('codigoEmprestarDevolver').value;
    const nomeUsuario = document.getElementById('idUsuarioEmprestar').value;

    const usuarioEncontrado = novaBiblioteca.usuarios.find(user => user.registroAcademico === nomeUsuario);

    if (!usuarioEncontrado) {
        console.log("Usuário não encontrado no sistema.");
        return;
    }

    novaBiblioteca.emprestarItem(codigo, usuarioEncontrado);
   
}

function devolverItem() {
    const codigo = document.getElementById('codigoEmprestarDevolver').value;

    novaBiblioteca.devolverItem(codigo);
    
}



