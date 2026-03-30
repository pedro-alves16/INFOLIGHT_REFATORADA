const botaoEnvio = document.getElementById('botao_cadastro');

botaoEnvio.addEventListener('click', async e => {
    e.preventDefault();

    const inputUser = document.getElementById('input_nome');
    const inputEmail = document.getElementById('input_email')
    const inputSenha = document.getElementById('input_password');

    const res = await axios.post('/users/login', {
        email: inputEmail.value,
        password: inputSenha.value
    });

    window.location.href = `/users/dashboard?user=${res.data.userName}`;
    
})