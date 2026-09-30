// prototip-ruan-fest.js

//1. salvar os dados do agendamento

function salvarAgendamento() {
    var endereco  = document.getElementById('iendereco').value;
    var contato   = document.getElementById('icontato').value;
    var data      = document.getElementById('idata').value;
    var brinquedo = document.getElementById('ibrinquedo').value;

    // validação
    if (endereco === '' || contato === '' || data === '' || brinquedo === '') {
        alert('Por favor, preencha todos os campos antes de continuar.');
        return false;
    }

    //salva os dados no localStorage para usar no resumo
    localStorage.setItem('agendamento_endereco',  endereco);
    localStorage.setItem('agendamento_contato',   contato);
    localStorage.setItem('agendamento_data',      data);
    localStorage.setItem('agendamento_brinquedo', brinquedo);

    window.location.href = 'resumo.html';
}

// 2. carregar os dados no resumo

function carregarResumo() {
    var endereco  = localStorage.getItem('agendamento_endereco');
    var contato   = localStorage.getItem('agendamento_contato');
    var data      = localStorage.getItem('agendamento_data');
    var brinquedo = localStorage.getItem('agendamento_brinquedo');

    //verifica se vieram dados do formulário
    if (!endereco) {
        document.getElementById('resumo-conteudo').innerHTML =
            '<p>Nenhum agendamento encontrado. <a href="agendamento.html">Fazer agendamento</a></p>';
        return;
    }

    var dataFormatada = formatarData(data);

    var nomeBrinquedo = brinquedo === 'grande'
        ? 'Pula-Pula Grande (4,27m)'
        : 'Pula-Pula Pequeno (2,50m)';

    // preenche os campos do resumo
    document.getElementById('resumo-brinquedo').textContent = nomeBrinquedo;
    document.getElementById('resumo-data').textContent      = dataFormatada;
    document.getElementById('resumo-endereco').textContent  = endereco;
    document.getElementById('resumo-contato').textContent   = contato;
}

//3. finalizar o pedido

function finalizarPedido() {
    // limpa os dados salvos
    localStorage.removeItem('agendamento_endereco');
    localStorage.removeItem('agendamento_contato');
    localStorage.removeItem('agendamento_data');
    localStorage.removeItem('agendamento_brinquedo');

    alert('Pedido finalizado! Entraremos em contato em breve.');
    window.location.href = 'index.html';
}

//4. formatar data

function formatarData(data) {
    if (!data) return '';
    var partes = data.split('-');          // ['2026', '04', '12']
    return partes[2] + '/' + partes[1] + '/' + partes[0];  // '12/04/2026'
}
