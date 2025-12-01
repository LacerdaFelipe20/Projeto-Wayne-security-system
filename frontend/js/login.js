document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    const inputUser = document.getElementById("username");
    const inputPass = document.getElementById("password");
    const errorEl = document.getElementById("errorMessage");

    function showMessage(text, isError = true) {
        if (!errorEl) {
            if (isError) console.warn(text); else console.log(text);
            return;
        }
        errorEl.textContent = text;
        errorEl.className = isError ? "error" : "success";
    }

    if (!form) {
        console.error("Form de login não encontrado (id='loginForm').");
        return;
    }

    form.addEventListener("submit", async (ev) => {
        ev.preventDefault();

        const username = inputUser?.value?.trim();
        const password = inputPass?.value?.trim();

        if (!username || !password) {
            showMessage("Preencha usuário e senha.", true);
            return;
        }

        const payload = { email: username, password };

        try {
            const res = await fetch("http://127.0.0.1:5000/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json().catch(() => null);

            if (!res.ok) {
                const msg = data && (data.message || data.msg)
                    ? (data.message || data.msg)
                    : `Erro: ${res.status}`;
                showMessage(msg, true);
                console.log("Resposta de login (erro):", data);
                return;
            }

            const access = data?.tokens?.access_token || data?.access_token || data?.token;
            const refresh = data?.tokens?.refresh_token || data?.refresh_token;

            if (!access) {
                showMessage("Resposta inválida do servidor (sem access token).", true);
                console.log("Resposta completa:", data);
                return;
            }

            const cleanAccess = access.replace(/\s+/g, "").replace(/^<|>$/g, "");
            localStorage.setItem("token", cleanAccess);

            if (refresh) {
                const cleanRefresh = refresh.replace(/\s+/g, "").replace(/^<|>$/g, "");
                localStorage.setItem("refresh_token", cleanRefresh);
            }

            if (data.user_id) localStorage.setItem("loggedUser", data.user_id);
            if (data.role) localStorage.setItem("userRole", data.role);
            

            showMessage("Login efetuado com sucesso!", false);
            setTimeout(() => window.location.href = "dashboard.html", 300);

        } catch (err) {
            console.error("Erro na requisição de login:", err);
            showMessage("Erro na conexão com o servidor.", true);
        }
    });
});
