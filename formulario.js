// ==================== UTEIS ====================
function $(id) { return document.getElementById(id); }

function mostrarToast(msg, tipo) {
    const toast = document.createElement('div');
    toast.className = ``toast ${tipo}``;
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 300); }, 3500);
}

// ==================== GERAR NUMERO DE INSCRICAO ====================
function gerarInscricao() {
    const existente = $('numeroInscricao').value;
    if (existente && existente !== 'Gerado automaticamente') return existente;
    const ano = new Date().getFullYear();
    const seq = Math.floor(Math.random() * 9000) + 1000;
    const codigo = `LDV-${ano}-${seq}`;
    $('numeroInscricao').value = codigo;
    return codigo;
}

// ==================== NIS TOGGLE ====================
function toggleNis() {
    const sim = $('benefSim').checked;
    $('nisField').classList.toggle('visible', sim);
    if (!sim) { $('nis').value = ''; }
    calcularPontuacao();
}

// ==================== CALCULAR MEDIAS ====================
function mediaDe(...nums) {
    const vals = nums.filter(n => n !== '' && n !== null && !isNaN(parseFloat(n)));
    if (vals.length === 0) return null;
    return vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length;
}

function calularMedias() {
    // Língua Portuguesa
    const lpVals = [$('lp6').value, $('lp7').value, $('lp8').value, $('lp9').value];
    const mediaLP = mediaDe(...lpVals);
    $('mediaLP').textContent = mediaLP !== null ? mediaLP.toFixed(1) : '–';

    // Matemática
    const mtVals = [$('mt6').value, $('mt7').value, $('mt8').value, $('mt9').value];
    const mediaMT = mediaDe(...mtVals);
    $('mediaMT').textContent = mediaMT !== null ? mediaMT.toFixed(1) : '–';

    // Média Final
    const medias = [mediaLP, mediaMT].filter(m => m !== null);
    const mediaFinal = medias.length > 0 ? medias.reduce((a, b) => a + b, 0) / medias.length : null;
    $('mediaFinal').textContent = mediaFinal !== null ? mediaFinal.toFixed(1) : '–';

    calcularPontuacao();
}

// ==================== CALCULAR PONTUACAO TOTAL ====================
function calcularPontuacao() {
    // Beneficiário
    let pontosBenef = 0;
    if ($('benefSim').checked && $('nis').value.trim() !== '') {
        pontosBenef = 10;
    }

    // Origem Escolar
    let pontosOrigem = 0;
    const origemSel = document.querySelector('input[name="origem"]:checked');
    if (origemSel) {
        pontosOrigem = parseInt(origemSel.value);
    }

    const totalBenefOrigem = pontosBenef + pontosOrigem;
    $('totalBenefOrigem').textContent = totalBenefOrigem;

    // Média Final
    const mediaFinalTexto = $('mediaFinal').textContent;
    const mediaFinalVal = mediaFinalTexto !== '–' ? parseFloat(mediaFinalTexto) : 0;
    $('totalMediaFinal').textContent = mediaFinalTexto !== '–' ? mediaFinalTexto : '–';

    // Entrevista
    const entrevistaVal = parseFloat($('entrevista').value) || 0;
    $('totalEntrevista').textContent = $('entrevista').value ? entrevistaVal.toFixed(1) : '–';

    // Total Geral (soma simples: benef+origem + media + entrevista)
    const totalGeral = totalBenefOrigem + mediaFinalVal + entrevistaVal;
    $('totalGeral').textContent = totalGeral.toFixed(1);
}

// ==================== SALVAR INSCRICAO ====================
function salvarInscricao() {
    const nome = $('nome').value.trim();
    if (!nome) {
        mostrarToast('❌ Preencha o nome do candidato antes de salvar.', 'err');
        return;
    }

    const cursoSel = document.querySelector('input[name="curso"]:checked');
    if (!cursSel) {
        mostrarToast('❌ Selecione um curso pretendido.', 'err');
        return;
    }

    const numero = gerarInscricao();

    const inscricao = {
        numero: numero,
        nome: nome,
        rg: $('rg').value,
        rgExpedidor: $('rgExpedidor').value,
        cpf: $('cpf').value,
        dataNascimento: $('dataNascimento').value,
        endereco: $('endereco').value,
        numeroEnd: $('numero').value,
        bairro: $('bairro').value,
        municipio: $('municipio').value,
        uf: $('uf').value,
        telefoneFixo: $('telefoneFixo').value,
        celularA: $('celularA').value,
        celularB: $('celularB').value,
        email: $('email').value,
        curso: cursoSel.value,
        nomeResponsavel: $('nomeResponsavel').value,
        dataInscricao: $('dataInscricao').value,
        cgm: $('cgm').value,
        beneficiario: document.querySelector('input[name="beneficiario"]:checked')?.value || 'nao',
        nis: $('nis').value,
        origemEscolar: document.querySelector('input[name="origem"]:checked')?.value || '0',
        medias: {
            lp6: $('lp6').value, lp7: $('lp7').value, lp8: $('lp8').value, lp9: $('lp9').value,
            mt6: $('mt6').value, mt7: $('mt7').value, mt8: $('mt8').value, mt9: $('mt9').value
        },
        mediaFinal: $('mediaFinal').textContent,
        entrevista: $('entrevista').value,
        totalGeral: $('totalGeral').textContent,
        dataSalvamento: new Date().toISOString()
    };

    // Salvar no localStorage
    let inscricoes = JSON.parse(localStorage.getItem('inscricoesLDV')) || [];
    // Atualizar se já existe (mesmo número)
    const idx = inscricoes.findIndex(i => i.numero === numero);
    if (idx >= 0) { inscricoes[idx] = inscricao; } else { inscricoes.push(inscricao); }
    localStorage.setItem('inscricoesLDV', JSON.stringify(inscricoes));

    // Mostrar comprovante
    $('compNumero').textContent = numero;
    $('compNome').textContent = nome;
    $('compPontos').textContent = $('totalGeral').textContent + ' pontos';
    $('compCurso').textContent = cursoSel.value;
    $('comprovante').style.display = 'block';
    $('comprovante').scrollIntoView({ behavior: 'smooth' });

    mostrarToast('✅ Inscrição salva com sucesso! Nº' + numero, 'success');
}

// ==================== IMPRIMIR ====================
function imprimirInscricao() {
    if (!$('nome').value.trim()) {
        mostrarToast('⚠️ Preencha os dados antes de imprimir.', 'info');
    }
    window.print();
}

// ==================== LIMPAR ====================
function limparFormulario() {
    if (confirm('Tem certeza que desja limpar todo o formulário?')) {
        document.querySelectorAll('input:not([type="radio"]):not([type="date"])').forEach(i => i.value = '');
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        document.querySelectorAll('input[type="date"]').forEach(d => d.value = '');
        $('municipio').value = 'Dois Vizinhos';
        $('uf').value = 'PR';
        $('mediaLP').textContent = '–';
        $('mediaMT').textContent = '–';
        $('mediaFinal').textContent = '–';
        $('totalBenefOrigem').textContent = '0';
        $('totalMediaFinal').textContent = '–';
        $('totalEntrevista').textContent = '–';
        $('totalGeral').textContent = '0';
        $('nisField').classList.remove('visible');
        $('comprovante').style.display = 'none';
        $('numeroInscricao').value = '';
        mostrarToast('🗑 Formulário limpo.', 'info');
    }
}

// ==================== INICIALIZACAO ====================
function inicalizar() {
    // Restaurar dados se houver no localStorage
    const inscricoes = JSON.parse(localStorage.getItem('inscricoesLDV')) || [];
    if (inscricoes.length >0) {
        const ultima = inscricoes[inscricoes.length -1];
        // Preencher campos básicos
        $('nome').value = ultima.nome || '';
        $('numeroInscricao').value = ultima.numero || '';
        // Não preenche tudo para não sobrescrever intencionalmente
    }

    // Garantir data míima para o campo de data
    const hoje = new Date().toISOString().split('T')[0];
    if ($('dataInscricao')) $('dataInscricao').value = hoje;

    // Gerar número de inscrição ao carregar
    gerarInscricao();
}

document.addEventListener('DOMContentLoaded', inicializar);
