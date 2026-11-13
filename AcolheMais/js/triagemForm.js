//Arquivo responsável pelo formulário passo a passo e a lógica de decisão final
const etapas = document.querySelectorAll('.etapa');
const btnAvancar = document.querySelectorAll('.btn-avancar');
const btnVoltar = document.querySelectorAll('.btn-voltar');
const formTriagem = document.getElementById('formularioTriagem');
const resultadoFinal = document.getElementById('resultadoFinal');

let etapaAtual = 0;
// Função para mostrar a etapa atual
function mostrarEtapa(index) {
    etapas.forEach(etapa => etapa.classList.remove('ativo'));
    etapas[index].classList.add('ativo');
}
// Inicializa mostrando a primeira etapa, verificando preenchimento dos campos
function validarEtapaAtual() {
    const inputs = etapas[etapaAtual].querySelectorAll('input, select');
    for (let input of inputs) {
        if (!input.checkValidity()) {
            input.reportValidity();
            return false;
        }
    }
    return true;
}
//Correçaão de erro no formulário, para que a tecla Enter só funcione se os campos estiverem preenchidos corretamente, em teste ao clicar na tecla Enter, o formulário finalizava e pulava direto para o resultado final, mesmo que os campos não estivessem preenchidos corretamente. Agora, a tecla Enter só funciona se os campos estiverem preenchidos corretamente, caso contrário, o formulário não avança para a próxima etapa.
formTriagem.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault(); 
        
        if (etapaAtual === etapas.length - 1) {
            document.querySelector('.btn-finalizar').click();
        } else {
            if (validarEtapaAtual()) {
                etapaAtual++;
                mostrarEtapa(etapaAtual);
            }
        }
    }
});
//Execução da ação do botão Avançar e Voltar, para que o usuário possa navegar entre as etapas do formulário.
btnAvancar.forEach(botao => {
    botao.addEventListener('click', () => {
        if (validarEtapaAtual() && etapaAtual < etapas.length - 1) {
            etapaAtual++;
            mostrarEtapa(etapaAtual);
        }
    });
});

btnVoltar.forEach(botao => {
    botao.addEventListener('click', () => {
        if (etapaAtual > 0) {
            etapaAtual--;
            mostrarEtapa(etapaAtual);
        }
    });
});
// Função para validar o formulário antes de enviar, recolhe as informações dos inputs, monta o perfil do paciente e salva no navegador. Também apaga qualquer diário antigo armazenado, esconde o formulário e exibe na tela o diagnóstico final colorido com base nos sintomas, junto com os botões de redirecionamento
formTriagem.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const nome = document.getElementById('nomePaciente').value;
    const dor = parseInt(document.getElementById('nivelDor').value) || 0;
    const sintoma = document.getElementById('sintoma').value;

    const dadosPaciente = {
        nome: nome,
        nivelDor: dor,
        sintomaPrincipal: sintoma,
        data: new Date().toLocaleDateString('pt-BR')
    };
    
    localStorage.setItem('acolheMais_paciente', JSON.stringify(dadosPaciente));
    localStorage.removeItem('acolheMais_diario'); 
    
    formTriagem.style.display = 'none';

    let mensagem = "";
    
    if (sintoma === 'grave' || dor > 8) {
        mensagem = `${nome}, dirija-se imediatamente à emergência médica.`;
    } else if (sintoma === 'moderado' || dor >= 5) {
        mensagem = `${nome}, recomendamos agendar uma consulta no posto de saúde ainda hoje.`;
    } else {
        mensagem = `${nome}, seus sintomas são leves. Beba água, repouse e agende uma consulta de rotina.`;
    }

   resultadoFinal.style.display = 'block';
    resultadoFinal.innerHTML = `
        <div class="resultado">
           ${mensagem}
        </div>
        <br>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <button onclick="location.reload()" class="btn btn-secundario">Fazer nova triagem</button>
            <button onclick="window.location.href='cuidados.html'" class="btn btn-secundario">Ir para Meus Cuidados</button>
        </div>
    `;
});