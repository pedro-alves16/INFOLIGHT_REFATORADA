const dialogConta = document.getElementById("dialogConta");
const formConta = document.getElementById("formConta");
const tabelaConsumos = document.getElementById("tabelaConsumos");
const tabelaVazia = document.getElementById("tabelaVazia");
const paginacaoContas = document.getElementById("paginacaoContas");
const paginaAnterior = document.getElementById("paginaAnterior");
const paginaProxima = document.getElementById("paginaProxima");
const indicadorPagina = document.getElementById("indicadorPagina");
const dialogEyebrow = document.getElementById("dialogEyebrow");
const dialogTitulo = document.getElementById("dialogTitulo");
const botaoSalvarConta = document.getElementById("botaoSalvarConta");
const contas = [];
let contaEmEdicaoId = null;

// Controla a paginação dos registros mensais exibidos na tabela.
const contasPorPagina = 4;
let paginaAtual = 1;

const nomesBandeiras = { verde: "Verde", amarela: "Amarela", vermelha: "Vermelha" };
const coresBandeiras = {
  verde: "rgba(44, 155, 107, 0.78)",
  amarela: "rgba(232, 177, 43, 0.82)",
  vermelha: "rgba(218, 79, 65, 0.82)",
};
const formatarValor = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
const formatarMes = (mes) => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${mes}-01T00:00:00`));

// Seleciona os quatro registros da página atual.
function renderizarTabela() {
  const ordenadas = [...contas].sort((a, b) => b.mes.localeCompare(a.mes));
  const totalPaginas = Math.max(1, Math.ceil(ordenadas.length / contasPorPagina));
  paginaAtual = Math.min(paginaAtual, totalPaginas);
  const inicio = (paginaAtual - 1) * contasPorPagina;
  const contasDaPagina = ordenadas.slice(inicio, inicio + contasPorPagina);
  tabelaConsumos.innerHTML = contasDaPagina.map((conta) => `
    <tr><th scope="row">${formatarMes(conta.mes)}</th><td>${formatarValor(conta.valor)}</td><td><span class="bandeira bandeira-${conta.bandeira}">${nomesBandeiras[conta.bandeira]}</span></td><td><div class="acoes-conta"><button class="botao-acao-conta botao-editar-conta" type="button" data-acao="editar" data-id="${conta.id}">Editar</button><button class="botao-acao-conta botao-excluir-conta" type="button" data-acao="excluir" data-id="${conta.id}">Excluir</button></div></td></tr>
  `).join("");
  tabelaVazia.hidden = ordenadas.length > 0;
  paginacaoContas.hidden = totalPaginas === 1;
  indicadorPagina.textContent = `Página ${paginaAtual} de ${totalPaginas}`;
  paginaAnterior.disabled = paginaAtual === 1;
  paginaProxima.disabled = paginaAtual === totalPaginas;
}
// Fim da seção de paginação dos registros mensais.

const grafico = new Chart(document.getElementById("meuGrafico"), {
  type: "bar",
  data: { labels: [], datasets: [{ label: "Conta de luz (R$)", data: [], backgroundColor: [], borderColor: "#2c9b6b", borderRadius: 6, borderWidth: 1 }] },
  options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: "#687872", usePointStyle: true, padding: 18 } } }, scales: { x: { grid: { display: false }, ticks: { color: "#687872" } }, y: { beginAtZero: true, grid: { color: "#e6eee9" }, ticks: { color: "#687872" } } } },
});
function atualizarResumo() {
  const ordenadas = [...contas].sort((a, b) => b.mes.localeCompare(a.mes));
  const ultima = ordenadas[0];
  document.getElementById("ultimaContaValor").textContent = ultima ? formatarValor(ultima.valor) : formatarValor(0);
  document.getElementById("ultimaContaPeriodo").textContent = ultima ? formatarMes(ultima.mes) : "Nenhuma conta cadastrada";
  const media = contas.length ? contas.reduce((total, conta) => total + conta.valor, 0) / contas.length : 0;
  document.getElementById("valorMedio").textContent = formatarValor(media);
  document.getElementById("valorMedioPeriodo").textContent = `média de ${contas.length} ${contas.length === 1 ? "mês" : "meses"}`;
  const anterior = ordenadas[1];
  const variacao = ultima && anterior ? ((ultima.valor - anterior.valor) / anterior.valor) * 100 : 0;
  document.getElementById("variacaoMensal").textContent = `${variacao > 0 ? "+" : ""}${variacao.toFixed(1).replace(".", ",")}%`;
  document.getElementById("variacaoMensalTexto").textContent = anterior ? `comparado a ${formatarMes(anterior.mes)}` : "Cadastre mais uma conta";
}

function atualizarDashboard() {
  renderizarTabela();
  atualizarResumo();
  const ordenadas = [...contas].sort((a, b) => a.mes.localeCompare(b.mes));
  grafico.data.labels = ordenadas.map((conta) => formatarMes(conta.mes));
  grafico.data.datasets[0].data = ordenadas.map((conta) => conta.valor);
  grafico.data.datasets[0].backgroundColor = ordenadas.map((conta) => coresBandeiras[conta.bandeira]);
  grafico.update();
}

async function carregarContas() {
  const resposta = await fetch("/contas", { credentials: "same-origin" });
  if (resposta.status === 401) {
    window.location.href = "/users/login";
    return;
  }
  if (!resposta.ok) return atualizarDashboard();
  const dados = await resposta.json();
  contas.splice(0, contas.length, ...dados.map((conta) => ({ id: conta.id, mes: conta.mes, valor: Number(conta.valor), bandeira: conta.bandeira })));
  atualizarDashboard();
}

function abrirDialogParaAdicionar() {
  contaEmEdicaoId = null;
  formConta.reset();
  dialogEyebrow.textContent = "NOVA CONTA DE LUZ";
  dialogTitulo.textContent = "Adicionar conta";
  botaoSalvarConta.textContent = "Salvar conta";
  dialogConta.showModal();
}

function abrirDialogParaEditar(conta) {
  contaEmEdicaoId = conta.id;
  formConta.elements.mes.value = conta.mes;
  formConta.elements.valor.value = conta.valor;
  formConta.elements.bandeira.value = conta.bandeira;
  dialogEyebrow.textContent = "EDITAR CONTA DE LUZ";
  dialogTitulo.textContent = "Editar conta";
  botaoSalvarConta.textContent = "Salvar alterações";
  dialogConta.showModal();
}

document.querySelector(".botao-adicionar-conta").addEventListener("click", abrirDialogParaAdicionar);
document.getElementById("fecharDialog").addEventListener("click", () => dialogConta.close());
document.getElementById("cancelarDialog").addEventListener("click", () => dialogConta.close());
tabelaConsumos.addEventListener("click", async (evento) => {
  const botao = evento.target.closest("button[data-acao]");
  if (!botao) return;

  const conta = contas.find((item) => item.id === Number(botao.dataset.id));
  if (!conta) return;
  if (botao.dataset.acao === "editar") return abrirDialogParaEditar(conta);
  if (!window.confirm(`Excluir a conta de ${formatarMes(conta.mes)}?`)) return;

  try {
    const resposta = await fetch(`/contas/${conta.id}`, { method: "DELETE", credentials: "same-origin" });
    if (resposta.status === 401) return (window.location.href = "/users/login");
    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      return window.alert(erro?.error || "Não foi possível excluir a conta.");
    }
    await carregarContas();
  } catch {
    window.alert("Não foi possível conectar ao servidor.");
  }
});
paginaAnterior.addEventListener("click", () => {
  if (paginaAtual > 1) {
    paginaAtual -= 1;
    renderizarTabela();
  }
});
paginaProxima.addEventListener("click", () => {
  if (paginaAtual < Math.ceil(contas.length / contasPorPagina)) {
    paginaAtual += 1;
    renderizarTabela();
  }
});

// Seção que coleta os dados preenchidos e envia a conta de luz para o backend.
formConta.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const dados = new FormData(formConta);
  const editando = contaEmEdicaoId !== null;
  try {
    const resposta = await fetch(editando ? `/contas/${contaEmEdicaoId}` : "/contas", {
      method: editando ? "PUT" : "POST",
      credentials: "same-origin",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ mes: dados.get("mes"), valor: Number(dados.get("valor")), bandeira: dados.get("bandeira") }),
    });

    if (resposta.status === 401) {
      window.location.href = "/users/login";
      return;
    }

    if (!resposta.ok) {
      const erro = await resposta.json().catch(() => null);
      return window.alert(erro?.error || "Não foi possível salvar a conta.");
    }

    await carregarContas();
    formConta.reset();
  contaEmEdicaoId = null;
    dialogConta.close();
  } catch {
    window.alert("Não foi possível conectar ao servidor.");
  }
});
// Fim da seção de envio dos dados preenchidos da conta de luz.

carregarContas().catch(() => atualizarDashboard());


