const tabela = document.getElementById("tabela-recursos");
const filterType = document.getElementById("filter-type");
const filterStatus = document.getElementById("filter-status");
const btnFilter = document.getElementById("btn-filter");
const btnRefresh = document.getElementById("btn-refresh");
const btnOpenCreate = document.getElementById("btn-open-create");

const modalBackdrop = document.getElementById("modal-backdrop");
const modalTitle = document.getElementById("modal-title");
const fieldId = document.getElementById("field-id");
const fieldName = document.getElementById("field-name");
const fieldType = document.getElementById("field-type");
const fieldStatus = document.getElementById("field-status");
const fieldDescription = document.getElementById("field-description");
const btnSaveModal = document.getElementById("btn-save-modal");
const btnCancelModal = document.getElementById("btn-cancel-modal");

function openModal(mode = "create", resource = null) {
    modalBackdrop.style.display = "flex";
    modalBackdrop.setAttribute("aria-hidden", "false");
    if (mode === "create") {
        modalTitle.textContent = "Cadastrar Recurso";
        fieldId.value = "";
        fieldName.value = "";
        fieldType.value = "";
        fieldStatus.value = "disponível";
        fieldDescription.value = "";
    } else {
        modalTitle.textContent = "Editar Recurso";
        fieldId.value = resource.id;
        fieldName.value = resource.name || resource.nome || "";
        fieldType.value = resource.type || resource.tipo || "";
        fieldStatus.value = resource.status || "disponível";
        fieldDescription.value = resource.description || resource.descricao || "";
    }
}

function closeModal() {
    modalBackdrop.style.display = "none";
    modalBackdrop.setAttribute("aria-hidden", "true");
}

btnCancelModal.addEventListener("click", (e) => { e.preventDefault(); closeModal(); });
document.addEventListener("keydown", (ev) => { if (ev.key === "Escape") closeModal(); });

function montarLinha(r) {
    const tr = document.createElement("tr");
    const statusClass = (r.status || "").toLowerCase().includes("dispon") ? "status-available" : (r.status || "").toLowerCase().includes("uso") ? "status-used" : "";
    tr.innerHTML = `
        <td>${r.id ?? ""}</td>
        <td>${r.name ?? r.nome ?? ""}</td>
        <td>${r.type ?? r.tipo ?? ""}</td>
        <td class="${statusClass}">${r.status ?? ""}</td>
        <td>${r.description ?? r.descricao ?? ""}</td>
        <td>
            <button class="btn small" data-action="edit" data-id="${r.id}">Editar</button>
            <button class="btn danger small" data-action="delete" data-id="${r.id}">Excluir</button>
        </td>
    `;
    return tr;
}

async function carregarRecursos() {
    if (!tabela) return;
    tabela.innerHTML = "";

    const tipo = filterType.value?.trim();
    const status = filterStatus.value?.trim();
    const qs = new URLSearchParams();
    if (tipo) qs.set("type", tipo);
    if (status) qs.set("status", status);
    const path = qs.toString() ? `/resources?${qs.toString()}` : "/resources";


    try {
        const recursos = await apiFetch(path);
        if (!Array.isArray(recursos)) {
            tabela.innerHTML = `<tr><td colspan="6">Resposta inválida do servidor.</td></tr>`;
            return;
    }
    if (recursos.length === 0) {
        tabela.innerHTML = `<tr><td colspan="6" class="mensagem-vazia">Nenhum recurso encontrado.</td></tr>`;
        return;
    }
    recursos.forEach(r => tabela.appendChild(montarLinha(r)));
    } catch (err) {
    console.error("Erro ao carregar recursos:", err);
    tabela.innerHTML = `<tr><td colspan="6">Erro ao carregar recursos.</td></tr>`;
    }
}

btnOpenCreate.addEventListener("click", () => openModal("create"));

btnSaveModal.addEventListener("click", async () => {
    const id = fieldId.value;
    const name = fieldName.value.trim();
    const type = fieldType.value.trim();
    const status = fieldStatus.value;
    const description = fieldDescription.value.trim();

    if (!name || !type) {
        alert("Preencha pelo menos nome e tipo.");
        return;
    }

    try {
    if (!id) {

        await apiFetch("/resources/register", {
        method: "POST",
        body: JSON.stringify({ name, type, status, description })
        });
        alert("Recurso criado com sucesso!");
    } else {
        await apiFetch(`/resources/${id}`, {
            method: "PUT",
            body: JSON.stringify({ name, type, status, description })
        });
            alert("Recurso atualizado com sucesso!");
    }
    closeModal();
    carregarRecursos();
} catch (err) {
    console.error("Erro salvar recurso:", err);
    let msg = "Erro ao salvar recurso.";
    if (err && err.body && err.body.message) msg = err.body.message;
    alert(msg);
    }
});

tabela.addEventListener("click", async (ev) => {
    const btn = ev.target.closest("button");
    if (!btn) return;
    const action = btn.getAttribute("data-action");
    const id = btn.getAttribute("data-id");
    if (!action || !id) return;

    if (action === "edit") {
        try {
            const r = await apiFetch(`/resources/${id}`);
            openModal("edit", r);
    } catch (err) {
        console.error("Erro ao buscar recurso:", err);
        alert("Erro ao carregar recurso para edição.");
    }
    } else if (action === "delete") {
    const ok = confirm("Deseja realmente deletar este recurso?");
    if (!ok) return;
    try {
        await apiFetch(`/resources/${id}`, { method: "DELETE" });
        alert("Recurso deletado.");
        carregarRecursos();
    } catch (err) {
        console.error("Erro ao deletar:", err);
        alert("Erro ao deletar recurso.");
    }
    }
});

btnFilter.addEventListener("click", carregarRecursos);
btnRefresh.addEventListener("click", carregarRecursos);
carregarRecursos();
