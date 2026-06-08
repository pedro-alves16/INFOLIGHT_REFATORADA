const botaoAtualizarPerfil = document.getElementById("btnSaveProfile");
const botaoAtualizarSenha = document.getElementById("btnUpdatePassword");

botaoAtualizarPerfil.addEventListener("click", async (e) => {
  const inputNome = document.getElementById("fullName");
  const inputEmail = document.getElementById("email");

  const res = await axios.put("/users/update", {
    userName: inputNome.value,
    email: inputEmail.value,
  });

  console.log("novo usuario", res.data);
});

botaoAtualizarSenha.addEventListener("click", async (e) => {
  const inputSenhaAtual = document.getElementById("currentPassword");
  const inputSenhaNova = document.getElementById("newPassword");

  const res = await axios.put("/users/password", {
    senhaAntiga: inputSenhaAtual.value,
    senhaNova: inputSenhaNova.value,
  });
});
