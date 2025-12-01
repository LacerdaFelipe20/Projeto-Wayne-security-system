document.getElementById("registerForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("newUsername").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("newPassword").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();
    const registerMessage = document.getElementById("registerMessage");

    if (!username || !email || !password || !confirmPassword) {
        registerMessage.textContent = "Preencha todos os campos!";
        registerMessage.style.color = "red";
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent = "As senhas não coincidem!";
        registerMessage.style.color = "red";
        return;
    }

    fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            registerMessage.textContent = "Conta criada com sucesso!";
            registerMessage.style.color = "lightgreen";
            setTimeout(() => window.location.href = "login.html", 2000);
        } else {
            registerMessage.textContent = "Erro ao registrar: " + data.message;
            registerMessage.style.color = "red";
        }
    })
    .catch(() => {
        registerMessage.textContent = "Erro de conexão com o servidor.";
        registerMessage.style.color = "red";
    });

    registerMessage.textContent = "Conta criada com sucesso!";
    registerMessage.style.color = "lightgreen";
    setTimeout(() => window.location.href = "login.html", 2000);
});