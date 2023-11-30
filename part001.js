


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
        // const res = awai acervoAPI.json()
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
        criarPopup("Por favor, preencha todos os campos antes de adicionar o usuário.");
        return; // irá sair da funçao aqui caso algum campo estiver vazio
    }

    const novoUsuario = new Usuario(nome, registroAcademico, dataNascimento, novaBiblioteca.usuarios.length + 1);
    novaBiblioteca.adicionarUser(novoUsuario);

    document.getElementById('nomeUsuario').value = '';
    document.getElementById('registroUsuario').value = '';
    document.getElementById('dataNascimentoUsuario').value = '';

    criarPopup("Usuário adicionado com sucesso!");
}

function adicionarItem() {
    const titulo = document.getElementById('tituloItem').value;
        const autor = document.getElementById('autorItem').value;
        const anoPublicacao = document.getElementById('anoPublicacaoItem').value;
        const codigo = document.getElementById('codigoItem').value;
        const genero = document.getElementById('generoItem').value;

        if (titulo.length === 0 || codigo.length === 0) {
            criarPopup("Por favor, preencha todos os campos antes de adicionar o item");
            return; // irá sair da funçao aqui caso algum campo estiver vazio
        }

        const novoItem = new Livro(titulo, autor, anoPublicacao, codigo, genero);
        novaBiblioteca.adicionarItem(novoItem);

        document.getElementById('tituloItem').value = '';
        document.getElementById('autorItem').value = '';
        document.getElementById('anoPublicacaoItem').value = '';
        document.getElementById('codigoItem').value = '';

        criarPopup("Item adicionado ao acervo com sucesso!");
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
        const status = item.emprestado ? 'Emprestado' : 'Disponivel';
        const statusText = item.emprestado ? `<span class="emprestado">${status} para ${item.usuarioEmprestimo.nome}</span>` : `<span class="disponivel">${status}</span>`;
        // Criando o HTML dinamicamente, possibilitando a alteraçao de cor para disponibilidade do item.
        li.innerHTML = `${item.titulo} - ${statusText} - COD: ${item.codigo}`;
        listaAcervo.appendChild(li);
    });
}
function emprestarItem() {
    const codigo = document.getElementById('codigoEmprestarDevolver').value;
    const nomeUsuario = document.getElementById('idUsuarioEmprestar').value;

    // Verifica se os campos estão preenchidos, caso contrario encerra aqui.
    if (codigo.length === 0 || nomeUsuario.length === 0) {
        criarPopup("Por favor, preencha todos os campos.");
        return;
    }

    const usuarioEncontrado = novaBiblioteca.usuarios.find(user => user.registroAcademico === nomeUsuario);

    if (!usuarioEncontrado) {
        criarPopup("Usuário não encontrado no sistema.");
        return;
    }

    novaBiblioteca.emprestarItem(codigo, usuarioEncontrado);
}

function devolverItem() {
    const codigo = document.getElementById('codigoEmprestarDevolver').value;

    // Verifica se os campos estão preenchidos, caso contario encerra aqui.
    if (!codigo) {
        criarPopup("Por favor, preencha o campo de código.");
        return;
    }

    novaBiblioteca.devolverItem(codigo);
    
}

// Testes para Modal / Popup

// Funçao que cria um elemento div e adiciona um popup com a mensagem, recebe como parâmetro a própria mensagem e tem um tempo prédefinido de 3 segundos.

function criarPopup(mensagem) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = mensagem;

    document.body.appendChild(popup);

    setTimeout(() => {
        popup.remove(); 
    }, 3000); 
}



