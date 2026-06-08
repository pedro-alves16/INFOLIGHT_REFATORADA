const botaoAtualizarPerfil = document.getElementById("btnSaveProfile");
const botaoAtualizarSenha = document.getElementById("btnUpdatePassword");
const botaoDeleta = document.getElementById("btnDeleteAccount");

botaoAtualizarPerfil.addEventListener("click", async (e) => {
  const inputNome = document.getElementById("fullName");
  const inputEmail = document.getElementById("email");

  const res = await axios.put("/users/update", {
    userName: inputNome.value,
    email: inputEmail.value,
  });

  if (!res.data.error) {
    alert("usuario atualizado com sucesso!");
    return;
  }
  console.log("novo usuario", res.data);
});

botaoAtualizarSenha.addEventListener("click", async (e) => {
  const inputSenhaAtual = document.getElementById("currentPassword");
  const inputSenhaNova = document.getElementById("newPassword");

  const res = await axios.put("/users/password", {
    senhaAntiga: inputSenhaAtual.value,
    senhaNova: inputSenhaNova.value,
  });

  if (!res.data.error) {
    alert("Senha Alterada com sucesso!");
    return;
  }
});

botaoDeleta.addEventListener("click", async (e) => {
  const inputSenhaDeletar = document.getElementById("currentPasswordDelete");

  const res = await axios.delete("/users/delete", {
    data: { senha: inputSenhaDeletar.value },
  });

  if (!res.data.error) {
    alert("conta deletada com sucesso!");
  } else {
    alert("algo deu errado, tente novamente!");
  }

  window.location.href = "/";
});
