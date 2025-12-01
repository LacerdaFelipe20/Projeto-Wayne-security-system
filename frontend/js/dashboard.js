async function updateDashboard() {
    const token = localStorage.getItem("token");
    if (!token) {

    console.warn("Token não encontrado. Redirecionando para login.");
    window.location.href = "login.html";
    return;
}

    try {
        const res = await fetch("http://127.0.0.1:5000/dashboard", {
        headers: { "Authorization": "Bearer " + token }
    });

    if (!res.ok) {
        console.error("Falha ao buscar /dashboard:", res.status, res.statusText);
        const text = await res.text().catch(() => null);
        console.log("Resposta (texto):", text);
        document.getElementById("userCount").textContent = "Erro ao carregar";
        document.getElementById("resourceCount").textContent = "-";
        document.getElementById("logCount").textContent = "-";
        return;
    }

    const payload = await res.json().catch(async () => {
        const txt = await res.text().catch(() => null);
        console.error("Resposta não-JSON:", txt);
        return null;
    });

    if (!payload) {
        document.getElementById("userCount").textContent = "Resposta inválida";
        return;
    }

    console.log("/dashboard payload:", payload);

    let totalUsers = null;
    let totalResources = null;
    let recentLogs = [];

    if ("total_users" in payload || "total_resources" in payload) {
        totalUsers = payload.total_users ?? 0;
        totalResources = payload.total_resources ?? 0;
        recentLogs = payload.recent_logs ?? payload.recentLogs ?? [];
    } else if (payload.data && payload.data.usuarios) {
        totalUsers = payload.data.usuarios.total ?? 0;
        totalResources = payload.data.recursos ? payload.data.recursos.total ?? 0 : 0;
        recentLogs = payload.data.logs_recentes ?? [];
    } else {
        totalUsers = payload.usersCount ?? payload.users_total ?? payload.totalUsers ?? 0;
        totalResources = payload.resourcesCount ?? payload.resources_total ?? payload.totalResources ?? 0;
        recentLogs = payload.logs ?? payload.recent_logs ?? payload.recentLogs ?? [];
    }

    const setText = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };

    setText("userCount", `${totalUsers} cadastrados`);
    setText("resourceCount", `${totalResources} ativos`);
    setText("logCount", `${Array.isArray(recentLogs) ? recentLogs.length : recentLogs} registros`);

    setText("usuariosPainel", `Total: ${totalUsers}`);
    setText("recursosPainel", `Total: ${totalResources}`);
    setText("logsPainel", `Total: ${Array.isArray(recentLogs) ? recentLogs.length : recentLogs}`);

    const notificationList = document.getElementById("notificationList");
    if (notificationList) {
        notificationList.innerHTML = "";

        if (Array.isArray(recentLogs) && recentLogs.length > 0) {
        recentLogs.slice(0, 5).forEach(l => {
            const li = document.createElement("li");
            li.textContent = l.action ?? l.acao ?? JSON.stringify(l);
            notificationList.appendChild(li);
        });
    } else {
        const li = document.createElement("li");
        li.textContent = "Nenhuma notificação";
        notificationList.appendChild(li);
    }
    }

    } catch (err) {
        console.error("Erro na requisição /dashboard:", err);
        document.getElementById("userCount").textContent = "Erro na conexão";
        document.getElementById("resourceCount").textContent = "-";
        document.getElementById("logCount").textContent = "-";
    }
}

const loggedUser = localStorage.getItem("loggedUser") || localStorage.getItem("userRole");
const userEmailEl = document.getElementById("userEmail");
if (userEmailEl) userEmailEl.textContent = loggedUser || "Usuário";

updateDashboard();
