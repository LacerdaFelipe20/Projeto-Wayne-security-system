async function carregarLogs(filtroUsuario = "", filtroAcao = "") {
    const tabela = document.getElementById("tabela-logs");
    if (!tabela) return;
    tabela.innerHTML = "";

    try {
        const qs = new URLSearchParams();
        if (filtroUsuario) qs.set("usuario", filtroUsuario);
        if (filtroAcao) qs.set("acao", filtroAcao);
        const path = qs.toString() ? `/logs?${qs.toString()}` : "/logs";

    const logs = await apiFetch(path);

    if (!Array.isArray(logs) || logs.length === 0) {
        tabela.innerHTML = `<tr><td colspan="5" class="mensagem-vazia">Nenhum log encontrado.</td></tr>`;
        return;
    }

    logs.forEach(log => {
        const linha = document.createElement("tr");
        linha.innerHTML = `
            <td>${log.id ?? ""}</td>
            <td>${log.user_name ?? log.usuario ?? ""}</td>
            <td>${log.action ?? log.acao ?? ""}</td>
            <td>${log.resource ?? log.recurso ?? ""}</td>
            <td>${log.timestamp ?? log.data ?? ""}</td>
        `;
        tabela.appendChild(linha);
    });

    } catch (err) {
        console.error("Erro carregarLogs:", err);
        tabela.innerHTML = `<tr><td colspan="5">Erro ao carregar logs.</td></tr>`;
    }
}

document.getElementById("btn-filtrar-logs")?.addEventListener("click", () => {
    const usuario = document.getElementById("filtro-usuario")?.value || "";
    const acao = document.getElementById("filtro-acao")?.value || "";
    carregarLogs(usuario, acao);
});

carregarLogs();
