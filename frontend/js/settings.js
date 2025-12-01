(() => {
    const body = document.body;
        const themeToggle = document.getElementById("themeToggle");
    const themeIcon = document.getElementById("themeIcon");
    const btnAlterarSenha = document.getElementById("btn_alterar_senha");

    const ICON_MOON = "./img/5878264.png";
    const ICON_SUN = "./img/sun-swgrepo-com.svg";

    function saferSetIcon(src) {
        if (!themeIcon) return;
        themeIcon.onerror = () => {
            if (themeToggle) themeToggle.textContent = src === ICON_SUN ? "☀️" : "🌙";
            themeIcon.style.display = "none";
            };
    themeIcon.onload = () => {
        if (themeToggle) themeToggle.textContent = "";
        themeIcon.style.display = "";
    };
    themeIcon.src = src;
    }


    function setDarkMode(active) {
        if (active) {
            body.classList.add("dark_mode");
            localStorage.setItem("theme", "dark");
            saferSetIcon(ICON_SUN);
        console.log("theme: dark");
        }else {
            body.classList.remove("dark_mode");
            localStorage.setItem("theme", "light");
            saferSetIcon(ICON_MOON);
            console.log("theme: light");
        }
    }


    function toggleTheme() {
        setDarkMode(!body.classList.contains("dark_mode"));
    }

    const saved = localStorage.getItem("theme");
        if (saved === "dark") setDarkMode(true);
        else if (saved === "light") setDarkMode(false);
        else {
            const prefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
            setDarkMode(prefersDark);
    }

    if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
        const btnTema = document.getElementById("btn_tema");
        if (btnTema) btnTema.addEventListener("click", toggleTheme);

    if (btnAlterarSenha) {
        btnAlterarSenha.addEventListener("click", () => {
            const senhaAtual = document.getElementById("senha_atual").value;
            const novaSenha = document.getElementById("nova_senha").value;
            const confirmarSenha = document.getElementById("confirmar_senha").value;
            const mensagem = document.getElementById("mensagem_senha");
            if (!senhaAtual || !novaSenha || !confirmarSenha) {
                if (mensagem) { mensagem.textContent = "Preencha todos os campos."; mensagem.className = "erro"; }
                return;
        }
        if (novaSenha !== confirmarSenha) {
            if (mensagem) { mensagem.textContent = "A nova senha e a confirmação não coincidem."; mensagem.className = "erro"; }
            return;
        }
        if (mensagem) { mensagem.textContent = "Senha alterada com sucesso!"; mensagem.className = "sucesso"; }
        document.getElementById("senha_atual").value = "";
        document.getElementById("nova_senha").value = "";
        document.getElementById("confirmar_senha").value = "";
    });
    } 
})();
