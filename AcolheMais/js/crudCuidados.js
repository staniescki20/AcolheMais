//Arquivo que gerencia a lógica da aba "Meus Cuidados" e o sistema do diário
const divBoasVindas = document.getElementById('boasVindas');
const formDiario = document.getElementById('formDiario');
const inputAnotacao = document.getElementById('novaAnotacao');
const listaDiario = document.getElementById('listaDiario');

let diario = [];
//Captura o contexto do paciente via local storage, caso ele tenha feito a triagem, exibe uma mensagem de boas-vindas personalizada com base nos sintomas e nível de dor. Também adiciona uma anotação inicial no diário caso não haja nenhuma anotação salva.
function carregarContextoPaciente() {
    const dadosSalvos = localStorage.getItem('acolheMais_paciente');
    
    if (dadosSalvos) {
        const paciente = JSON.parse(dadosSalvos);
        
        let sintomaFormatado = paciente.sintomaPrincipal === 'leve' ? 'sintomas leves' 
                             : paciente.sintomaPrincipal === 'moderado' ? 'sintomas moderados' 
                             : 'sintomas graves';

        let indicador= "";
        if (paciente.sintomaPrincipal === 'grave' || paciente.nivelDor > 8) {
            indicador= "<br><br><span ><strong>Recomendação Urgente:</strong> Por favor, dirija-se à emergência. Não tome medicamentos por conta própria sem avaliação médica prévia.</span>";
        } else if (paciente.sintomaPrincipal === 'moderado' || paciente.nivelDor >= 5) {
            indicador = "<br><br><span'><strong>Dica de Cuidado:</strong> Mantenha repouso e hidrate-se bem. Anote na lista abaixo a frequência dos seus sintomas para informar ao médico na sua consulta de hoje.</span>";
        } else {
            indicador = "<br><br><span style='color: var(--destaque);'><strong>Dica de Cuidado:</strong> Repouse, beba bastante água e evite esforço físico. Agende uma consulta de rotina para acompanhamento.</span>";
        }

        divBoasVindas.innerHTML = `
            <strong>Olá, ${paciente.nome}!</strong><br>
            Vimos que sua última triagem (${paciente.data}) indicou <strong>${sintomaFormatado}</strong> e nível de dor <strong>${paciente.nivelDor}/10</strong>.
            ${indicador}
            <br><br>Utilize o espaço abaixo para anotar tudo o que precisa conversar com o profissional de saúde.
        `;
        
        const diarioSalvo = localStorage.getItem('acolheMais_diario');
        if (!diarioSalvo) {
            diario.push({
                id: Date.now(),
                texto: `Relatar ao médico sobre os ${sintomaFormatado} e dor nível ${paciente.nivelDor}.`,
                concluido: false
            });
            salvarDiario();
        }
    } else {
        divBoasVindas.innerHTML = `
            <strong>Olá!</strong> Parece que você ainda não passou pela nossa Triagem Virtual.<br>
            <a href="triagem.html" style="color: var(--destaque); text-decoration: underline;">Clique aqui para fazer sua triagem primeiro</a> ou continue usando o diário abaixo.
        `;
    }
}
//Acessa o navegador para buscar o histórico do diário de consulta
function carregarDiario() {
    const dados = localStorage.getItem('acolheMais_diario');
    if (dados) {
        diario = JSON.parse(dados);
    }
    renderizarDiario();
}
//Local Storage é usado para salvar o diário de consultas, garantindo que as anotações do usuário sejam mantidas mesmo após fechar o navegador ou atualizar a página.
function salvarDiario() {
    localStorage.setItem('acolheMais_diario', JSON.stringify(diario));
}
//Renderiza o diário de consultas na tela, exibindo cada anotação com opções para marcar como resolvida ou excluir. A interface é atualizada dinamicamente sempre que uma ação é realizada.
function renderizarDiario() {
    listaDiario.innerHTML = '';

    if (diario.length === 0) {
        listaDiario.innerHTML = '<li style="text-align:center; color:#999; margin-top: 1rem;">Nenhuma anotação ainda.</li>';
        return;
    }

    diario.forEach((item) => {
        const li = document.createElement('li');
        li.className = `item-diario ${item.concluido ? 'concluido' : ''}`;
        
        // Estrutura HTML do item da lista atualizada para usar as classes do CSS
        li.innerHTML = `
            <div class="item-diario-content">
                <span>${item.texto}</span>
                
                <div class="item-diario-botoes">
                    <button onclick="alternarStatus(${item.id})" class="btn-diario btn-resolvido">
                        ${item.concluido ? 'Desmarcar' : 'Resolvido'}
                    </button>
                    
                    <button onclick="excluirItem(${item.id})" class="btn-diario btn-excluir">
                        Excluir
                    </button>
                </div>
            </div>
        `;
        listaDiario.appendChild(li);
    });
}
// Adiciona um evento de envio ao formulário do diário, permitindo que o usuário adicione novas anotações. As anotações são validadas para garantir que não sejam vazias antes de serem salvas e renderizadas na tela.
formDiario.addEventListener('submit', (e) => {
    e.preventDefault();
    const texto = inputAnotacao.value.trim();
    
    if (texto) {
        diario.push({
            id: Date.now(),
            texto: texto,
            concluido: false
        });
        salvarDiario();
        renderizarDiario();
        formDiario.reset();
    }
});
// Alterna o status de conclusão de uma anotação no diário, permitindo que o usuário marque uma anotação como resolvida ou desmarque se necessário. A interface é atualizada imediatamente após a ação.
function alternarStatus(id) {
    const item = diario.find(i => i.id === id);
    if (item) {
        item.concluido = !item.concluido;
        salvarDiario();
        renderizarDiario();
    }
}
// Exclui uma anotação do diário com base no ID fornecido, removendo-a da lista e atualizando a interface e o armazenamento local.
function excluirItem(id) {
    diario = diario.filter(i => i.id !== id);
    salvarDiario();
    renderizarDiario();
}

carregarContextoPaciente();
carregarDiario();