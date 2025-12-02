const API = "/users";

function getToken() {
    let t = localStorage.getItem("token") || "";
    return t.replace(/\s+/g, "").replace(/^<|>$/g, "");
}

async function carregarUsuarios() {
    const tabela = document.getElementById("tabela_usuarios");
    if (!tabela) return;
    tabela.innerHTML = "";

    try {
        const data = await apiFetch(API);

        if (!Array.isArray(data)) {
            console.error("Resposta inesperada ao listar usuários:", data);
            tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar usuários.</td></tr>';
            alert("Erro ao carregar usuários.");
            return;
        }

        data.forEach(u => {
            const linha = document.createElement("tr");
            linha.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.email}</td>
                <td>${u.role}</td>
            `;
            tabela.appendChild(linha);
        });

    } catch (error) {
        console.error("Erro ao carregar usuários:", error);
        tabela.innerHTML = '<tr><td colspan="4">Erro ao carregar usuários.</td></tr>';
        alert("Erro ao carregar usuários.");
    }
}

async function cadastrarUsuario() {
    const nome = document.getElementById("input_nome")?.value?.trim();
    const email = document.getElementById("input_email")?.value?.trim();
    const senha = document.getElementById("input_senha")?.value?.trim();

    if (!nome || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        await apiFetch(API + "/register", {
            method: "POST",
            body: JSON.stringify({
                nome,
                email,
                password: senha,
                role: "user"
            })
        });

        alert("Usuário cadastrado!");
        carregarUsuarios();

        document.getElementById("input_nome").value = "";
        document.getElementById("input_email").value = "";
        document.getElementById("input_senha").value = "";

    } catch (err) {
        console.error("Erro no cadastro:", err);
        alert("Erro ao cadastrar usuário.");
    }
}

document.getElementById("btn_cadastrar_usuario")?.addEventListener("click", cadastrarUsuario);

carregarUsuarios();