$(function () {
  const API_URL = '/api/tarefas';

  // Banco de dados local do catálogo de livros para complementar os dados do back-end
  const CATALOGO_LIVROS = [
    {
      titulo: "Crime e Castigo",
      autor: "Fiódor Dostoiévski",
      capa: "assets/crime_e_castigo.jpg",
      sinopse: "Uma das obras mais célebres da literatura mundial. Narra a história de Raskólnikov, um jovem estudante que comete um assassinato em São Petersburgo e lida com as consequências psicológicas e morais do seu ato."
    },
    {
      titulo: "A Revolução dos Bichos",
      autor: "George Orwell",
      capa: "assets/a_revolução_dos_bichos_george_orwell.jpg",
      sinopse: "Uma sátira clássica sobre a ditadura e o totalitarismo, onde os animais de uma fazenda se rebelam contra seus donos humanos apenas para cair sob o controle autoritário dos porcos."
    },
    {
      titulo: "Água Viva",
      autor: "Clarice Lispector",
      capa: "assets/agua_viva.jpg",
      sinopse: "Um fluxo de consciência poético e profundo. Clarice Lispector explora o ato da criação, o tempo, e a essência do ser em uma prosa poética singular."
    },
    {
      titulo: "A Hora da Estrela",
      autor: "Clarice Lispector",
      capa: "assets/hora_estrela.jpg",
      sinopse: "A história comovente de Macabéa, uma datilógrafa alagoana órfã e solitária no Rio de Janeiro, contada pelo narrador fictício Rodrigo S.M."
    },
    {
      titulo: "Livro do Desassossego",
      autor: "Fernando Pessoa",
      capa: "assets/livro_desassossego.jpg",
      sinopse: "A obra-prima em prosa de Fernando Pessoa, assinada por seu semi-heterônimo Bernardo Soares. Uma coleção de fragmentos, diários e meditações existenciais."
    },
    {
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      capa: "assets/dom_casmurro_machado_de_assis.jpg",
      sinopse: "Um dos maiores clássicos da literatura brasileira. O narrador Bento Santiago reconta sua vida e tenta responder à dúvida que o assombra por décadas: teria Capitu o traído com Escobar?"
    },
    {
      titulo: "O Alquimista",
      autor: "Paulo Coelho",
      capa: "assets/o_alquimista_paulo_coelho.jpg",
      sinopse: "A jornada mágica do jovem pastor espanhol Santiago rumo ao Egito, em busca de um tesouro escondido nas pirâmides e da descoberta de sua Lenda Pessoal."
    },
    {
      titulo: "Sapiens",
      autor: "Yuval Noah Harari",
      capa: "assets/sapiens_yuval_noah_harari.jpg",
      sinopse: "Uma viagem fascinante pela história da humanidade, desde os primeiros hominídeos até os avanços tecnológicos de hoje, explicando como nossa espécie dominou o planeta."
    },
    {
      titulo: "1984",
      autor: "George Orwell",
      capa: "assets/1984.jpg",
      sinopse: "A aterrorizante distopia futurista onde o Grande Irmão controla tudo e todos, vigiando a população e punindo severamente qualquer indício de pensamento rebelde."
    },
    {
      titulo: "Torto Arado",
      autor: "Itamar Vieira Junior",
      capa: "assets/torto_arado_itamar_vieira_junior.jpg",
      sinopse: "Um romance épico e lírico sobre a vida de duas irmãs no sertão baiano, unidas por um acidente de infância e pela luta pela sobrevivência e pela terra."
    },
    {
      titulo: "Vidas Secas",
      autor: "Graciliano Ramos",
      capa: "assets/vidas_secas.jpg",
      sinopse: "O clássico do romance regionalista que relata a saga de Fabiano e sua família de retirantes que fogem da seca devastadora no sertão nordestino."
    },
    {
      titulo: "A Garota no Trem",
      autor: "Paula Hawkins",
      capa: "assets/a_garota_no_trem_paula_hawkins.jpg",
      sinopse: "Um thriller psicológico eletrizante que narra a obsessão de Rachel por um casal que ela observa todos os dias da janela do trem, até testemunhar algo chocante."
    },
    {
      titulo: "O Poder do Hábito",
      autor: "Charles Duhigg",
      capa: "assets/o_poder_do_habito.jpg",
      sinopse: "Uma análise reveladora sobre como os hábitos funcionam e como podemos alterá-los em nossa vida pessoal, profissional e na sociedade para alcançar o sucesso."
    },
    {
      titulo: "Pai Rico Pai Pobre",
      autor: "Robert Kiyosaki",
      capa: "assets/pai_rico_pai_pobre_robert_kiyosaki.jpg",
      sinopse: "O livro de finanças pessoais mais vendido do mundo. Apresenta valiosas lições sobre dinheiro e investimentos sob a ótica de dois pais com visões opostas."
    },
    {
      titulo: "Cem Anos de Solidão",
      autor: "Gabriel García Márquez",
      capa: "assets/cem_anos_de_solidão_gabriel_garcía_márquez.jpg",
      sinopse: "A obra-prima do realismo mágico que narra a saga multigeracional da família Buendía na misteriosa e isolada aldeia de Macondo."
    },
    {
      titulo: "O Pequeno Príncipe",
      autor: "Antoine de Saint-Exupéry",
      capa: "assets/o_pequeno_príncipe_antoine_de_saintexupéry.jpg",
      sinopse: "Uma história poética e filosófica sobre a amizade, o amor e a perda, contada pelo olhar puro de um jovem habitante do asteroide B-612."
    },
    {
      titulo: "Mulheres que Correm com os Lobos",
      autor: "Clarissa Pinkola Estés",
      capa: "assets/mulheres_que_correm_com_os_lobos_clarissa_pinkola_.jpg",
      sinopse: "Um estudo profundo sobre a psique feminina e os mitos associados à Mulher Selvagem, ajudando a resgatar a força e a sabedoria ancestrais das mulheres."
    },
    {
      titulo: "A Sutil Arte de Ligar o Foda-se",
      autor: "Mark Manson",
      capa: "assets/a_sutil_arte_de_ligar_o_fodase_mark_manson.jpg",
      sinopse: "Um livro de autoajuda realista que propõe que paremos de tentar ser positivos o tempo todo para focarmos no que realmente importa."
    },
    {
      titulo: "Os Sete Maridos de Evelyn Hugo",
      autor: "Taylor Jenkins Reid",
      capa: "assets/os_sete_maridos_de_evelyn_hugo_taylor_jenkins_reid.jpg",
      sinopse: "A lendária estrela de Hollywood Evelyn Hugo decide contar sua verdadeira história e seus segredos mais íntimos, revelando um grande amor proibido."
    },
    {
      titulo: "Mentirosos",
      autor: "E. Lockhart",
      capa: "assets/mentirosos_e_lockhart.jpg",
      sinopse: "Uma família rica e perfeita, uma ilha particular e um segredo perturbador. Um suspense instigante sobre mentiras, segredos e o preço da perfeição."
    },
    {
      titulo: "É Assim que Acaba",
      autor: "Colleen Hoover",
      capa: "assets/é_assim_que_acaba_colleen_hoover.jpg",
      sinopse: "O romance mais famoso de Colleen Hoover. Uma emocionante jornada sobre amor, superação, força pessoal e as complexidades de relacionamentos difíceis."
    },
    {
      titulo: "Amor e Gelato",
      autor: "Jenna Evans Welch",
      capa: "assets/amor_e_gelato_jenna_evans_welch.jpg",
      sinopse: "Lina viaja para a Itália em busca do passado de sua mãe e descobre os encantos de Florença, novas amizades e, é claro, um grande amor."
    },
    {
      titulo: "Rápido e Devagar",
      autor: "Daniel Kahneman",
      capa: "assets/rápido_e_devagar_daniel_kahneman.jpg",
      sinopse: "O prêmio Nobel de economia Daniel Kahneman nos leva a uma viagem pela mente humana e nos mostra como tomamos decisões na vida pessoal e nos negócios."
    }
  ];

  // 1. Popular o select com os livros do catálogo
  const $select = $('#select-todo-book');
  CATALOGO_LIVROS.forEach((livro, index) => {
    $select.append(`<option value="${index}">${livro.titulo} — ${livro.autor}</option>`);
  });

  // 2. Controlar a atualização do painel de prévia de livro
  $select.on('change', function () {
    const selectedIdx = $(this).val();
    if (selectedIdx !== null && selectedIdx !== '') {
      const livro = CATALOGO_LIVROS[selectedIdx];

      // Atualizar a interface da prévia
      $('#preview-cover').attr('src', livro.capa).attr('alt', livro.titulo);
      $('#preview-title').text(livro.titulo);
      $('#preview-author').text(livro.autor);
      $('#preview-desc').text(livro.sinopse);

      // Alternar visualização (esconder placeholder e exibir prévia)
      $('#book-preview-placeholder').attr('style', 'display: none !important;');
      $('#book-preview-container').removeAttr('style');

      // Habilitar botão de adicionar
      $('#btn-add-todo').removeAttr('disabled');
    } else {
      // Resetar visualização (esconder prévia e exibir placeholder)
      $('#book-preview-container').attr('style', 'display: none !important;');
      $('#book-preview-placeholder').removeAttr('style');

      // Desabilitar botão de adicionar
      $('#btn-add-todo').attr('disabled', 'true');
    }
  });

  // 3. Carregar tarefas do back-end
  function carregarLeituras() {
    $.ajax({
      url: API_URL,
      type: 'GET',
      dataType: 'json',
      success: function (tarefas) {
        // Limpar as listas
        $('#pending-list').empty();
        $('#completed-list').empty();

        let countPending = 0;
        let countCompleted = 0;

        tarefas.forEach(tarefa => {
          let textoCompleto = tarefa.texto || '';
          let concluida = false;
          let titulo = '';
          let autor = '';

          // Decodificar status PENDENTE / LIDO e separar título e autor
          if (textoCompleto.startsWith('[LIDO] ')) {
            concluida = true;
            textoCompleto = textoCompleto.substring(7); // Remove '[LIDO] '
          } else if (textoCompleto.startsWith('[PENDENTE] ')) {
            concluida = false;
            textoCompleto = textoCompleto.substring(11); // Remove '[PENDENTE] '
          } else {
            // Fallback caso venha uma string bruta sem marcadores
            concluida = false;
          }

          const partes = textoCompleto.split(' — ');
          if (partes.length >= 2) {
            titulo = partes[0];
            autor = partes[1];
          } else {
            titulo = textoCompleto || 'Sem Título';
            autor = 'Autor Desconhecido';
          }

          // Buscar dados do catálogo local para carregar capa e sinopse
          const livroCatalogo = CATALOGO_LIVROS.find(l => l.titulo.toLowerCase() === titulo.toLowerCase());

          let coverHTML = '';
          let sinopseHTML = '';

          if (livroCatalogo) {
            coverHTML = `
              <div style="width: 70px; min-width: 70px; height: 105px; aspect-ratio: 2/3; overflow: hidden; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
                <img src="${livroCatalogo.capa}" alt="${escapeAttr(titulo)}" style="width: 100%; height: 100%; object-fit: cover;">
              </div>
            `;
            sinopseHTML = `
              <p class="todo-desc is-size-7 text-muted" style="margin-top: 0.5rem; line-height: 1.4; font-style: italic; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;" title="${escapeAttr(livroCatalogo.sinopse)}">
                ${escapeHTML(livroCatalogo.sinopse)}
              </p>
            `;
          } else {
            // Fallback caso seja um livro cadastrado de fora do catálogo
            coverHTML = `
              <div class="is-flex is-align-items-center is-justify-content-center" style="width: 70px; min-width: 70px; height: 105px; background: linear-gradient(135deg, var(--color-accent-gold), var(--color-primary-brown-dark)); color: white; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15); font-size: 1.5rem;">
                <i class="fa-solid ${concluida ? 'fa-book' : 'fa-book-open'}"></i>
              </div>
            `;
            sinopseHTML = `
              <p class="todo-desc is-size-7 text-muted" style="margin-top: 0.5rem; line-height: 1.4; font-style: italic;">
                Livro importado de fonte externa.
              </p>
            `;
          }

          const itemHTML = `
            <div class="todo-item ${concluida ? 'completed' : ''}" data-id="${tarefa.id}" style="padding: 1.25rem;">
              <div class="todo-info" style="align-items: flex-start; gap: 1.25rem;">
                ${coverHTML}
                <div style="flex-grow: 1; min-width: 0;">
                  <h4 class="todo-title font-serif" style="margin-bottom: 0.25rem; font-size: 1.15rem; line-height: 1.2; font-weight: 700; color: var(--bulma-text);">${escapeHTML(titulo)}</h4>
                  <p class="todo-author text-muted" style="margin-bottom: 0; font-size: 0.9rem; font-weight: 500;">${escapeHTML(autor)}</p>
                  ${sinopseHTML}
                </div>
              </div>
              <div class="todo-actions" style="align-self: center; margin-left: 1rem;">
                <button class="button action-btn ${concluida ? 'btn-undo' : 'btn-done'}" 
                        title="${concluida ? 'Mover para Para Ler' : 'Marcar como Lido'}"
                        data-action="toggle" 
                        data-status="${concluida}" 
                        data-title="${escapeAttr(titulo)}" 
                        data-author="${escapeAttr(autor)}">
                  <i class="${concluida ? 'fa-solid fa-arrow-rotate-left' : 'fa-regular fa-circle-check'}"></i>
                </button>
                <button class="button action-btn btn-delete" title="Excluir" data-action="delete">
                  <i class="fa-regular fa-trash-can"></i>
                </button>
              </div>
            </div>
          `;

          if (concluida) {
            $('#completed-list').append(itemHTML);
            countCompleted++;
          } else {
            $('#pending-list').append(itemHTML);
            countPending++;
          }
        });

        // Atualizar os contadores na tela
        $('#count-pending').text(countPending);
        $('#count-completed').text(countCompleted);
      },
      error: function (xhr, status, error) {
        console.error('Erro ao buscar tarefas:', error);
        console.warn('Certifique-se de que o back-end (Spring Boot) está rodando localmente em http://localhost:8080');
      }
    });
  }

  // 4. Criar nova leitura baseada no catálogo
  $('#add-reading-form').on('submit', function (e) {
    e.preventDefault();

    const selectedIdx = $select.val();
    if (selectedIdx === null || selectedIdx === '') return;

    const livro = CATALOGO_LIVROS[selectedIdx];

    // O back-end só possui o campo 'texto'. Guardamos no formato '[PENDENTE] Título — Autor'
    const textoParaSalvar = `[PENDENTE] ${livro.titulo} — ${livro.autor}`;

    const novaTarefa = {
      texto: textoParaSalvar
    };

    $.ajax({
      url: API_URL,
      type: 'POST',
      contentType: 'application/json; charset=UTF-8',
      data: JSON.stringify(novaTarefa),
      dataType: 'json',
      success: function () {
        // Resetar select e prévia
        $select.val('');
        $select.trigger('change');
        // Recarregar a lista
        carregarLeituras();
      },
      error: function (xhr, status, error) {
        console.error('Erro ao adicionar leitura:', error);
        alert('Erro ao conectar com o servidor. O back-end está rodando?');
      }
    });
  });

  // 5. Ações nos itens (Alternar Status e Excluir)
  $(document).on('click', '.todo-actions button', function (e) {
    e.preventDefault();
    const btn = $(this);
    const todoItem = btn.closest('.todo-item');
    const id = todoItem.data('id');
    const action = btn.data('action');

    if (action === 'toggle') {
      const statusAtual = btn.data('status');
      const titulo = btn.data('title');
      const autor = btn.data('author');

      const novoStatus = !statusAtual;
      const textoParaSalvar = `${novoStatus ? '[LIDO]' : '[PENDENTE]'} ${titulo} — ${autor}`;

      const tarefaAtualizada = {
        id: id,
        texto: textoParaSalvar
      };

      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'PUT',
        contentType: 'application/json; charset=UTF-8',
        data: JSON.stringify(tarefaAtualizada),
        dataType: 'json',
        success: function () {
          carregarLeituras();
        },
        error: function (xhr, status, error) {
          console.error('Erro ao atualizar status da leitura:', error);
          alert('Erro ao atualizar leitura no servidor.');
        }
      });
    } else if (action === 'delete') {
      $.ajax({
        url: `${API_URL}/${id}`,
        type: 'DELETE',
        success: function () {
          todoItem.hide('slow', function () {
            carregarLeituras();
          });
        },
        error: function (xhr, status, error) {
          console.error('Erro ao excluir leitura:', error);
          alert('Erro ao excluir leitura no servidor.');
        }
      });
    }
  });

  // Funções auxiliares para evitar XSS
  function escapeHTML(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function escapeAttr(str) {
    return str
      .replace(/&/g, '&amp;')
      .replace(/'/g, '&#39;')
      .replace(/"/g, '&quot;');
  }

  // Carregar dados na inicialização
  carregarLeituras();
});
