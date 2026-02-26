const byId = id => document.getElementById(id);

const inputPotencia = byId('potencia');
const inputDiasMes = byId('dia');
const inputHoras = byId('horas');
const inputTarifa = byId('tarifa');
const botao = byId('botaoCalculo');

const consumoMensalTexto = document.querySelector('.mensal');
const custoMensalTexto = document.querySelector('.custo');
const custoDiarioTexto = document.querySelector('.diario');
const divResultados = document.querySelector('.calculadora-resultados');

const tarifasPorEstado = {
    'AC': 0.791, // Acre
    'AL': 0.863, // Alagoas
    'AM': 0.857, // Amazonas
    'AP': 0.808, // Amapá
    'BA': 0.821, // Bahia
    'CE': 0.722, // Ceará
    'DF': 0.743, // Distrito Federal
    'ES': 0.682, // Espírito Santo
    'GO': 0.745, // Goiás
    'MA': 0.711, // Maranhão
    'MG': 0.796, // Minas Gerais
    'MS': 0.870, // Mato Grosso do Sul
    'MT': 0.847, // Mato Grosso
    'PA': 0.938, // Pará (Um dos mais caros no Brasil)
    'PB': 0.588, // Paraíba (Um dos mais baratos no Brasil)
    'PE': 0.744, // Pernambuco
    'PI': 0.829, // Piauí
    'PR': 0.629, // Paraná
    'RJ': 0.870, // Rio de Janeiro
    'RN': 0.722, // Rio Grande do Norte
    'RO': 0.727, // Rondônia
    'RR': 0.661, // Roraima
    'RS': 0.701, // Rio Grande do Sul
    'SC': 0.618, // Santa Catarina
    'SE': 0.666, // Sergipe
    'SP': 0.671, // São Paulo
    'TO': 0.823  // Tocantins
};

let tarifa = 0.75;

const calcularConsumoKwh = (potencia, horas) => (potencia * horas)/1000

const calcularConsumoEmRealDia = (consumoEmKwh, tarifa) => consumoEmKwh * tarifa;

const calcularCustoMensalEmReal = (gastoEmRealDia) => gastoEmRealDia * 30;

const consumoMensalEmKwh = (gastoDiarioKwh) => gastoDiarioKwh * 30;


botao.addEventListener('click', (e) =>{
    e.preventDefault();
    const valorPotencia = Number(inputPotencia.value);
    const valorDias = Number(inputDiasMes.value);
    const valorHoras = Number(inputHoras.value);

    const resultadoKwh = calcularConsumoKwh(valorPotencia, valorHoras);

    const resultadoKwhMensal = consumoMensalEmKwh(resultadoKwh);

    consumoMensalTexto.innerText = `${resultadoKwhMensal} Kwh`;

    const resultadoCustoDiario = calcularConsumoEmRealDia(resultadoKwh, tarifa);
    
    const resultadoCustoMensal = calcularCustoMensalEmReal(resultadoCustoDiario);

    custoMensalTexto.innerText = ` R$ ${resultadoCustoMensal.toFixed(2)}`;

    custoDiarioTexto.innerText = `R$ ${resultadoCustoDiario.toFixed(2)}`;

    divResultados.style = 'Display: block';
})

const modal = document.querySelector('#modal');

window.addEventListener('load', () => {
    modal.showModal();
})

const botalModal = document.getElementById('modal-button');



botalModal.addEventListener('click', async () => {

    const valorCep = inputCep.value;

    if(!inputCep.value){
        criaErro(inputCep, 'Nenhum Cep Digitado');
        return;
    }

    const dadosDoEstado = await buscarEstado(valorCep);
    console.log(dadosDoEstado);

   if(tarifasPorEstado[dadosDoEstado]){
    tarifa = tarifasPorEstado[dadosDoEstado];
   } else {
        console.log('caiu aqui')
        criaErro(inputCep, 'CEP inválido ou inexistente');
        return;
   }

   inputTarifa.value = tarifa.toFixed(2);

    modal.close();
    modal.style = 'display:none';

})

async function buscarEstado(cep){

    const APIurl = `https://brasilapi.com.br/api/cep/v1/${cep}`

    const resposta = await fetch(APIurl);
    const data = await resposta.json();

    return data.state;
}

    const inputCep = document.getElementById('CEP-input');

inputCep.addEventListener('input', (e) => {
    let valor = e.target.value.replace(/\D/g, '');
    inputCep.value = valor;
})

function criaErro(campo, msg){
    
    const erroAnterior = campo.nextElementSibling;
    if(erroAnterior && erroAnterior.classList.contains('error-modal')){
        erroAnterior.remove();
    }

    const divErro = document.createElement('div');
    
    divErro.innerText = msg;
    divErro.classList.add('error-modal');

    campo.insertAdjacentElement('afterend', divErro);
}

inputCep.addEventListener('input', e => {
    let valor = e.target.value;
    valor = valor.substring(0, 8);
    inputCep.value = valor;
})