const overlay = document.getElementById("modal-overlay");
const openBtn = document.getElementById("btn-add-unit");
const closeBtn = document.getElementById("modal-close");
const form = document.getElementById("unit-form");

function openModal() {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
}

function closeModal() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    form.reset();
}

openBtn.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);

// fecha ao clicar fora do card do modal
overlay.addEventListener("click", (event) => {
    if (event.target === overlay) {
        closeModal();
    }
});

// fecha com a tecla Esc
document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay.classList.contains("is-open")) {
        closeModal();
    }
});

// envio do formulário — hoje só fecha o modal;
// troque este trecho quando plugar a chamada real de cadastro
form.addEventListener("submit", (event) => {
    event.preventDefault();

    const data = {
        nome: form["unit-name"].value,
        tipo: form["unit-type"].value,
        potencia: Number(form["unit-power"].value),
        horasUso: Number(form["unit-hours"].value),
        eficiencia: form["unit-efficiency"].value,
    };

    console.log("Novo aparelho:", data);

    closeModal();
});