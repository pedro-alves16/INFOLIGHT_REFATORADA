const botaoEnvio = document.getElementById("botao_cadastro");
const inputUser = document.getElementById("input_nome");
const inputEmail = document.getElementById("input_email");
const inputSenha = document.getElementById("input_password");

botaoEnvio.addEventListener("click", async (e) => {
  e.preventDefault();

  removeError();

  if (inputUser.value.length < 5) {
    console.log("menor que 3");
    createError(inputUser);
    return;
  }

  if (!inputEmail.value.includes("@")) {
    console.log("erro email");
    createError(inputEmail);
    return;
  }

  if (inputSenha.value.length < 3) {
    console.log("erro senha");
    createError(inputSenha);
    return;
  }

  const res = await axios.post("/users/create", {
    userName: inputUser.value,
    email: inputEmail.value,
    password: inputSenha.value,
  });

  console.log("RESPOSTA COMPLETA:", res.data);

  if (res.data.error) {
    Toastify({
      text: "Email já cadastrado, faça login",
      className: "info",
      style: {
        background: "red",
      },
      position: "center",
    }).showToast();

    inputEmail.value = "";
    return;
  } else {
    console.log("nao existe userName");
  }

  window.location.href = "/users/login";
});

function createError(input) {
  const divPai = input.closest(".input_div");
  const container = divPai.querySelector(".caixinha_mail");
  const errorMsg = divPai.querySelector(".error_msg");

  console.log("caiu no erro");

  container.style.borderColor = "red";
  errorMsg.style.display = "block";
}

function removeError() {
  const inputsArray = document.querySelectorAll("input");

  inputsArray.forEach((input) => {
    const divPai = input.closest(".input_div");
    const container = divPai.querySelector(".caixinha_mail");
    const errorMsg = divPai.querySelector(".error_msg");

    container.style.borderColor = "grey";
    errorMsg.style.display = "none";
  });
}
