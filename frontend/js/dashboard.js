const dialogConta = document.getElementById("dialogConta");
const formConta = document.getElementById("formConta");
const tabelaConsumos = document.getElementById("tabelaConsumos");
const tabelaVazia = document.getElementById("tabelaVazia");
const contas = [];

const nomesBandeiras = { verde: "Verde", amarela: "Amarela", vermelha: "Vermelha" };
const coresBandeiras = {
  verde: "rgba(44, 155, 107, 0.78)",
  amarela: "rgba(232, 177, 43, 0.82)",
  vermelha: "rgba(218, 79, 65, 0.82)",
};
const formatarValor = (valor) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(valor);
const formatarMes = (mes) => new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" }).format(new Date(`${mes}-01T00:00:00`));

function renderizarTabela() {
  const ordenadas = [...contas].sort((a, b) => b.mes.localeCompare(a.mes));
  tabelaConsumos.innerHTML = ordenadas.map((conta) => `
    <tr><th scope="row">${formatarMes(conta.mes)}</th><td>${formatarValor(conta.valor)}</td><td><span class="bandeira bandeira-${conta.bandeira}">${nomesBandeiras[conta.bandeira]}</span></td></tr>
  `).join("");
  tabelaVazia.hidden = ordenadas.length > 0;
}

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
  const resposta = await fetch("/contas");
  if (!resposta.ok) return atualizarDashboard();
  const dados = await resposta.json();
  contas.splice(0, contas.length, ...dados.map((conta) => ({ mes: conta.mes, valor: Number(conta.valor), bandeira: conta.bandeira })));
  atualizarDashboard();
}

document.querySelector(".botao-adicionar-conta").addEventListener("click", () => dialogConta.showModal());
document.getElementById("fecharDialog").addEventListener("click", () => dialogConta.close());
document.getElementById("cancelarDialog").addEventListener("click", () => dialogConta.close());

formConta.addEventListener("submit", async (evento) => {
  evento.preventDefault();
  const dados = new FormData(formConta);
  const resposta = await fetch("/contas", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mes: dados.get("mes"), valor: Number(dados.get("valor")), bandeira: dados.get("bandeira") }) });
  if (!resposta.ok) return window.alert("Não foi possível salvar a conta.");
  await carregarContas();
  formConta.reset();
  dialogConta.close();
});

carregarContas().catch(() => atualizarDashboard());


