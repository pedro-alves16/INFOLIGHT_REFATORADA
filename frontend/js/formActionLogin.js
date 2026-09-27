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

  try {
    const res = await axios.post("/users/login", {
      email: inputEmail.value,
      password: inputSenha.value,
    });

    if (!res.data.jwt) {
      Toastify({
        text: 'Acesso não autorizado!',
        className: "info",
        style: {
          background: "red",
        },
        position: "center",
      }).showToast();
    }
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

    if (res.status === 200) {
      localStorage.setItem('userToken', res.data.jwt);
      window.location.href = '/users/dashboard';
    }
  } catch (error) {
    const mensagemErro = error.response?.data?.error || 'Acesso não autorizado!';

    Toastify({
      text: mensagemErro,
      className: "info",
      style: {
        background: "red",
      },
      position: "center",
    }).showToast();
  }
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
