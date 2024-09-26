document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('solicitacaoForm');
    const solicitacoesList = document.getElementById('solicitacoesList');

    // Carrega solicitações salvas do LocalStorage
    const carregarSolicitacoes = () => {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        solicitacoesList.innerHTML = '';

        solicitacoes.forEach((solicitacao, index) => {
            const li = document.createElement('li');
            li.innerHTML = `${solicitacao.nomeSolicitante} solicitou ${solicitacao.quantidade} de ${solicitacao.nomeProduto} <button onclick="removerSolicitacao(${index})">Remover</button>`;
            solicitacoesList.appendChild(li);
        });
    };

    // Salva nova solicitação no LocalStorage
    const salvarSolicitacao = (solicitacao) => {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        solicitacoes.push(solicitacao);
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        carregarSolicitacoes();
    };

    // Remover solicitação
    window.removerSolicitacao = (index) => {
        const solicitacoes = JSON.parse(localStorage.getItem('solicitacoes')) || [];
        solicitacoes.splice(index, 1);
        localStorage.setItem('solicitacoes', JSON.stringify(solicitacoes));
        carregarSolicitacoes();
    };

    // Evento de envio do formulário
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nomeSolicitante = document.getElementById('nomeSolicitante').value;
        const nomeProduto = document.getElementById('nomeProduto').value;
        const quantidade = document.getElementById('quantidade').value;

        const novaSolicitacao = {
            nomeSolicitante,
            nomeProduto,
            quantidade
        };

        salvarSolicitacao(novaSolicitacao);

        form.reset();
    });

    carregarSolicitacoes();
});
