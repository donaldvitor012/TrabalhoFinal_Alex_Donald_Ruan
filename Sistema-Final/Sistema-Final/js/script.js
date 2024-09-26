document.getElementById("show-register").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("register-form").style.display = "block";
    document.getElementById("form-title").innerText = "Cadastro";
});

document.getElementById("show-login").addEventListener("click", function() {
    document.getElementById("login-form").style.display = "block";
    document.getElementById("register-form").style.display = "none";
    document.getElementById("form-title").innerText = "Login";
});

// Cadastro de usuário
document.getElementById("register-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("register-username").value;
    const password = document.getElementById("register-password").value;
    const role = document.getElementById("register-role").value;  // Tipo de usuário

    if (localStorage.getItem(username)) {
        document.getElementById("message").innerText = "Usuário já existe!";
    } else {
        const userData = {
            password: password,
            role: role
        };
        localStorage.setItem(username, JSON.stringify(userData));  // Armazena o tipo de usuário
        document.getElementById("message").innerText = "Usuário cadastrado com sucesso!";
    }
});

// Login do usuário
document.getElementById("login-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const username = document.getElementById("login-username").value;
    const password = document.getElementById("login-password").value;

    const userData = localStorage.getItem(username);

    if (userData) {
        const parsedUserData = JSON.parse(userData);

        if (parsedUserData.password === password) {
            document.getElementById("message").innerText = `Login bem-sucedido! Tipo de usuário: ${parsedUserData.role}`;
            
            // Aqui você pode redirecionar para páginas diferentes com base no tipo de usuário
            if (parsedUserData.role === "admin") {
                console.log("Bem-vindo, Admin!");
                // Redirecionar ou mostrar opções de admin
                 window.location.href="ADMIN/index.html"
            } else {
                console.log("Bem-vindo, Usuário Normal!");
                // Redirecionar ou mostrar opções de usuário normal
                 window.location.href="NORMAL/index.html"
            }
        } else {
            document.getElementById("message").innerText = "Senha incorreta!";
        }
    } else {
        document.getElementById("message").innerText = "Usuário não encontrado!";
    }
});
