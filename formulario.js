// ============================================================
// FUNÇÃO UTILITÁRIA: ATALHO PARA getElementById
// ============================================================
// Em vez de escrever document.getElementById('id') toda vez,
// usamos $('id') para encurtar o código.
function $(id) {
    return document.getElementById(id); // Retorna o elemento pelo ID informado
}

// ============================================================
// FUNÇÃO: MOSTRAR TOAST (NOTIFICAÇÃO)
// ============================================================
// Cria uma notificação flutuante no canto inferior direito.
// 'msg' é o texto, 'tipo' define a cor (success, error, info).
function mostrarToast(msg, tipo) {
    const toast = document.createElement('div');       // Cria uma nova div
    toast.className = `toast ${tipo}`;                  // Adiciona classes (toast + tipo)
    toast.textContent = msg;                            // Define o texto da mensagem
    document.body.appendChild(toast);                   // Insere no final do body
    // Após 3,5 segundos, começa a desaparecer
    setTimeout(() => {
        toast.style.opacity = '0';                      // Torna invisível (transição CSS)
        // Após 300ms (tempo da transição), remove do DOM
        setTimeout(() => toast.remove(), 300);
    }, 3500);
}

// ============================================================
// FUNÇÃO: FAZER LOGIN (BOTÃO "ENTRAR COM SENHA")
// ============================================================
// Verifica a senha digitada. Se correta → abre a Parte II.
// Se incorreta → mostra mensagem de erro.
function fazerLogin() {
    const senha = $('senhaLogin').value;                // Pega o valor digitado
    const SENHA_CORRETA = 'secretaria1234';              // Senha definida da secretaria

    // Compara a senha digitada com a correta
    if (senha === SENHA_CORRETA) {
        // --- CASO CORRETO ---
        $('telaLogin').style.display = 'none';          // Esconde a tela de login
        $('pagina1').classList.remove('active');        // Garante que Parte I está escondida
        $('pagina2').classList.add('active');           // Mostra a Parte II
        $('loginError').classList.remove('visible');    // Esconde mensagem de erro
        $('senhaLogin').value = '';                     // Limpa o campo de senha
        gerarInscricao();                               // Gera número de inscrição automático
        mostrarToast('✅ Acesso liberado!', 'success'); // Notifica sucesso
    } else {
        // --- CASO INCORRETO ---
        $('loginError').classList.add('visible');       // Mostra mensagem de erro
        $('senhaLogin').value = '';                     // Limpa o campo
        $('senhaLogin').focus();                        // Foca novamente no campo
        mostrarToast('❌ Senha incorreta.', 'error');   // Notifica erro
    }
}

// ============================================================
// FUNÇÃO: ABRIR PARTE I (BOTÃO "CONTINUAR SEM SENHA")
// ============================================================
// Não exige senha. Abre a Ficha de Inscrição (Parte I).
function abrirParteI() {
    $('telaLogin').style.display = 'none';              // Esconde a tela de login
    $('pagina2').classList.remove('active');            // Garante que Parte II está escondida
    $('pagina1').classList.add('active');               // Mostra a Parte I
    mostrarToast('📝 Preencha a Ficha de Inscrição.', 'info'); // Notifica
}

// ============================================================
// FUNÇÃO: VOLTAR AO LOGIN
// ============================================================
// Esconde ambas as partes e volta para a tela de login.
function voltarLogin() {
    $('pagina1').classList.remove('active');            // Esconde Parte I
    $('pagina2').classList.remove('active');            // Esconde Parte II
    $('telaLogin').style.display = 'block';             // Mostra tela de login
    $('senhaLogin').value = '';                         // Limpa campo de senha
    $('loginError').classList.remove('visible');        // Esconde erro
}

// ============================================================
// FUNÇÃO: GERAR NÚMERO DE INSCRIÇÃO
// ============================================================
// Cria um código único no formato LDV-ANO-XXXX.
function gerarInscricao() {
    const existente = $('numeroInscricao').value;       // Valor atual do campo
    // Se já existe um número válido, mantém (não gera outro)
    if (existente && existente !== 'Gerado automaticamente') {
        return existente;                               // Retorna o existente
    }
    const ano = new Date().getFullYear();               // Ano atual (ex: 2024)
    const seq = Math.floor(Math.random() * 9000) + 1000; // Número aleatório 1000-9999
    const codigo = `LDV-${ano}-${seq}`;                 // Monta o código completo
    $('numeroInscricao').value = codigo;                // Define no campo
    return codigo;                                      // Retorna o código
}

// ============================================================
// FUNÇÃO: TOGGLE NIS (MOSTRAR/ESCONDER CAMPO)
// ============================================================
// Se o usuário marcar "Sim" como beneficiário, mostra o campo NIS.
// Se marcar "Não", esconde e limpa o campo.
function toggleNis() {
    const sim = $('benefSim').checked;                  // Verifica se "Sim" está marcado
    $('nisField').classList.toggle('visible', sim);     // Adiciona/remove classe 'visible'
    if (!sim) {
        $('nis').value = '';                            // Se não, limpa o campo NIS
    }
    calcularPontuacao();                                // Recalcula a pontuação total
}

// ============================================================
// FUNÇÃO: MEDIADE (MÉDIA DE VÁRIOS NÚMEROS)
// ============================================================
// Recebe vários números, ignora vazios/inválidos e retorna a média.
// Se não houver números válidos, retorna null.
function mediaDe(...nums) { 
  // Filtra valores válidos, sem a letra 'e', menores ou iguais a 100
  const vals = nums.filter(n => {
    // Ignora logo se for vazio, nulo ou indefinido
    if (n === '' || n === null || n === undefined) return false;

    const strVal = String(n).toLowerCase().trim();

    // Bloqueia se contiver a letra 'e' (evita 'numero', '1e2000', '1e2', etc.)
    if (strVal.includes('e')) return false;

    const num = parseFloat(n);

    // Garante que é um número real válido, finito e menor ou igual a 100
    return !isNaN(num) && isFinite(num) && num <= 100;
  }); 

  if (vals.length === 0) return null; // Sem valores válidos → null 

  // Soma todos os valores válidos e divide pela quantidade 
  return vals.reduce((a, b) => a + parseFloat(b), 0) / vals.length;
}

// ============================================================
// FUNÇÃO: CALCULAR MÉDIAS (LP, MATEMÁTICA E FINAL)
// ============================================================
function calcularMedias() {
    // --- Língua Portuguesa ---
    const lpVals = [$('lp6').value, $('lp7').value, $('lp8').value, $('lp9').value];
    const mediaLP = mediaDe(...lpVals);                 // Calcula média
    $('mediaLP').textContent = mediaLP !== null ? mediaLP.toFixed(1) : '–'; // Exibe (1 decimal)

    // --- Matemática ---
    const mtVals = [$('mt6').value, $('mt7').value, $('mt8').value, $('mt9').value];
    const mediaMT = mediaDe(...mtVals);                 // Calcula média
    $('mediaMT').textContent = mediaMT !== null ? mediaMT.toFixed(1) : '–'; // Exibe

    // --- Média Final (média das duas médias) ---
    const medias = [mediaLP, mediaMT].filter(m => m !== null); // Remove nulos
    const mediaFinal = medias.length > 0
        ? medias.reduce((a, b) => a + b, 0) / medias.length
        : null;                                         // Calcula se houver dados
    $('mediaFinal').textContent = mediaFinal !== null ? mediaFinal.toFixed(1) : '–'; // Exibe

    calcularPontuacao();                                // Recalcula pontuação total
}

// ============================================================
// FUNÇÃO: CALCULAR PONTUAÇÃO TOTAL
// ============================================================
function calcularPontuacao() {
    // --- Beneficiário ---
    let pontosBenef = 0;                                // Começa com 0
    // Se "Sim" marcado E NIS preenchido → 10 pontos
    if ($('benefSim').checked && $('nis').value.trim() !== '') {
        pontosBenef = 10;
    }

    // --- Origem Escolar ---
    let pontosOrigem = 0;                               // Começa com 0
    const origemSel = document.querySelector('input[name="origem"]:checked'); // Radio marcado
    if (origemSel) {
        pontosOrigem = parseInt(origemSel.value);       // Converte para inteiro
    }

    // Soma beneficiário + origem
    const totalBenefOrigem = pontosBenef + pontosOrigem;
    $('totalBenefOrigem').textContent = totalBenefOrigem; // Exibe

    // --- Média Final ---
    const mediaFinalTexto = $('mediaFinal').textContent; // Texto exibido
    const mediaFinalVal = mediaFinalTexto !== '–' ? parseFloat(mediaFinalTexto) : 0; // Converte
    $('totalMediaFinal').textContent = mediaFinalTexto !== '–' ? mediaFinalTexto : '–'; // Exibe

    // --- Entrevista ---
    const entrevistaVal = parseFloat($('entrevista').value) || 0; // Converte ou 0
    $('totalEntrevista').textContent = $('entrevista').value ? entrevistaVal.toFixed(1) : '–'; // Exibe

    // --- TOTAL GERAL (soma de tudo) ---
    const totalGeral = totalBenefOrigem + mediaFinalVal + entrevistaVal;
    $('totalGeral').textContent = totalGeral.toFixed(1); // Exibe com 1 decimal
}

// ============================================================
// FUNÇÃO: SALVAR PARTE I (FICHA DE INSCRIÇÃO)
// ============================================================
// Valida o nome e salva os dados básicos no localStorage.
function salvarParteI() {
    const nome = $('nome').value.trim();                // Pega o nome
    if (!nome) {
        // Se vazio, avisa e para
        mostrarToast('❌ Preencha o nome antes de salvar.', 'error');
        return;
    }
    // Monta objeto com dados básicos
    const dados = {
        nome: nome,
        rg: $('rg').value,
        cpf: $('cpf').value,
        dataNascimento: $('dataNascimento').value,
        endereco: $('endereco').value,
        bairro: $('bairro').value,
        municipio: $('municipio').value,
        uf: $('uf').value,
        telefoneFixo: $('telefoneFixo').value,
        celularA: $('celularA').value,
        email: $('email').value,
        curso: document.querySelector('input[name="curso"]:checked')?.value || '',
        nomeResponsavel: $('nomeResponsavel').value,
        dataInscricao: $('dataInscricao').value,
        dataSalvamento: new Date().toISOString()        // Timestamp
    };
    // Salva no localStorage
    localStorage.setItem('inscricaoParteI', JSON.stringify(dados));
    mostrarToast('✅ Ficha de Inscrição salva!', 'success');
}

// ============================================================
// FUNÇÃO: SALVAR INSCRIÇÃO COMPLETA (PARTE II)
// ============================================================
function salvarInscricao() {
    const nome = $('nome').value.trim();                // Pega o nome
    if (!nome) {
        mostrarToast('❌ Preencha o nome do candidato antes de salvar.', 'error');
        return;
    }
    const cursoSel = document.querySelector('input[name="curso"]:checked');
    if (!cursoSel) {
        mostrarToast('❌ Selecione um curso pretendido.', 'error');
        return;
    }
    const numero = gerarInscricao();                    // Gera/obtém número

    // Monta objeto completo com TODOS os dados
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

    // Recupera inscrições existentes
    let inscricoes = JSON.parse(localStorage.getItem('inscricoesLDV')) || [];
    const idx = inscricoes.findIndex(i => i.numero === numero); // Procura pelo número
    if (idx >= 0) {
        inscricoes[idx] = inscricao;                    // Atualiza existente
    } else {
        inscricoes.push(inscricao);                     // Adiciona nova
    }
    localStorage.setItem('inscricoesLDV', JSON.stringify(inscricoes)); // Salva

    // Preenche comprovante
    $('compNumero').textContent = numero;
    $('compNome').textContent = nome;
    $('compPontos').textContent = $('totalGeral').textContent + ' pontos';
    $('compCurso').textContent = cursoSel.value;
    $('comprovante').style.display = 'block';           // Mostra comprovante
    $('comprovante').scrollIntoView({ behavior: 'smooth' }); // Rola até ele

    mostrarToast('✅ Inscrição salva! Nº ' + numero, 'success');
}

// ============================================================
// FUNÇÃO: IMPRIMIR
// ============================================================
function imprimirInscricao() {
    if (!$('nome').value.trim()) {
        mostrarToast('⚠️ Preencha os dados antes de imprimir.', 'info');
    }
    window.print();                                     // Abre diálogo de impressão
}

// ============================================================
// FUNÇÃO: LIMPAR FORMULÁRIO
// ============================================================
function limparFormulario() {
    // Confirmação do usuário
    if (confirm('Tem certeza que deseja limpar todo o formulário?')) {
        // Limpa todos os inputs exceto radio e date
        document.querySelectorAll('input:not([type="radio"]):not([type="date"])')
            .forEach(i => i.value = '');
        // Desmarca todos os radios
        document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
        // Limpa todos os dates
        document.querySelectorAll('input[type="date"]').forEach(d => d.value = '');

        // Restaura valores padrão
        $('municipio').value = 'Dois Vizinhos';
        $('uf').value = 'PR';

        // Reseta exibições
        $('mediaLP').textContent = '–';
        $('mediaMT').textContent = '–';
        $('mediaFinal').textContent = '–';
        $('totalBenefOrigem').textContent = '0';
        $('totalMediaFinal').textContent = '–';
        $('totalEntrevista').textContent = '–';
        $('totalGeral').textContent = '0';

        // Esconde NIS e comprovante
        $('nisField').classList.remove('visible');
        $('comprovante').style.display = 'none';
        $('numeroInscricao').value = '';

        mostrarToast('🗑 Formulário limpo.', 'info');
    }
}

// ============================================================
// FUNÇÃO: INICIALIZAR
// ============================================================
function inicializar() {
    // Recupera dados salvos da Parte I (se houver)
    const dadosParteI = JSON.parse(localStorage.getItem('inscricaoParteI'));
    if (dadosParteI) {
        $('nome').value = dadosParteI.nome || '';       // Restaura nome
        $('rg').value = dadosParteI.rg || '';           // Restaura RG
        $('cpf').value = dadosParteI.cpf || '';         // Restaura CPF
    }

    // Recupera inscrições completas
    const inscricoes = JSON.parse(localStorage.getItem('inscricoesLDV')) || [];
    if (inscricoes.length > 0) {
        const ultima = inscricoes[inscricoes.length - 1]; // Última
        $('nome').value = ultima.nome || '';               // Preenche nome
        $('numeroInscricao').value = ultima.numero || '';  // Preenche número
    }

    // Define a data de inscrição como hoje
    const hoje = new Date().toISOString().split('T')[0]; // Formato YYYY-MM-DD
    if ($('dataInscricao')) {
        $('dataInscricao').value = hoje;
    }
}

// ============================================================
// EVENTO: DOM CARREGADO
// ============================================================
// Quando o HTML terminar de carregar, executa a inicialização.
document.addEventListener('DOMContentLoaded', inicializar);
