const botaoEnvio = document.getElementById("botao_cadastro");

botaoEnvio.addEventListener("click", async (e) => {
  e.preventDefault();

  const inputEmail = document.getElementById("input_email");
  const inputSenha = document.getElementById("input_password");

  removeError();

  if (!inputEmail.value.includes("@")) {
    createError(inputEmail);
    return;
  }

  if (inputSenha.value.length < 3) {
    createError(inputSenha);
    return;
  }

  const res = await axios.post("/users/login", {
    email: inputEmail.value,
    password: inputSenha.value,
  });

  console.log(res.data);

  if (res.data.error) {
    Toastify({
      text: res.data.error,
      className: "info",
      style: {
        background: "red",
      },
      position: "center",
    }).showToast();
    return;
  }

  window.location.href = `/users/dashboard?user=${res.data.userName}`;
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
