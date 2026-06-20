document.addEventListener('DOMContentLoaded', () => {
  // Database of all 23 books in the catalog
  const LIVROS_DB = {
    "book-1": {
      titulo: "Crime e Castigo",
      autor: "Fiódor Dostoiévski",
      preco: 62.00,
      capa: "assets/crime_e_castigo.jpg"
    },
    "book-2": {
      titulo: "A Revolução dos Bichos",
      autor: "George Orwell",
      preco: 54.00,
      capa: "assets/a_revolução_dos_bichos_george_orwell.jpg"
    },
    "book-3": {
      titulo: "Água Viva",
      autor: "Clarice Lispector",
      preco: 40.00,
      capa: "assets/agua_viva.jpg"
    },
    "book-4": {
      titulo: "A Hora da Estrela",
      autor: "Clarice Lispector",
      preco: 37.00,
      capa: "assets/hora_estrela.jpg"
    },
    "book-5": {
      titulo: "Livro do Desassossego",
      autor: "Fernando Pessoa",
      preco: 49.00,
      capa: "assets/livro_desassossego.jpg"
    },
    "book-6": {
      titulo: "Dom Casmurro",
      autor: "Machado de Assis",
      preco: 35.00,
      capa: "assets/dom_casmurro_machado_de_assis.jpg"
    },
    "book-7": {
      titulo: "O Alquimista",
      autor: "Paulo Coelho",
      preco: 39.00,
      capa: "assets/o_alquimista_paulo_coelho.jpg"
    },
    "book-8": {
      titulo: "Sapiens",
      autor: "Yuval Noah Harari",
      preco: 59.00,
      capa: "assets/sapiens_yuval_noah_harari.jpg"
    },
    "book-9": {
      titulo: "1984",
      autor: "George Orwell",
      preco: 45.00,
      capa: "assets/1984.jpg"
    },
    "book-10": {
      titulo: "Torto Arado",
      autor: "Itamar Vieira Junior",
      preco: 52.00,
      capa: "assets/torto_arado_itamar_vieira_junior.jpg"
    },
    "book-11": {
      titulo: "Vidas Secas",
      autor: "Graciliano Ramos",
      preco: 32.00,
      capa: "assets/vidas_secas.jpg"
    },
    "book-12": {
      titulo: "A Garota no Trem",
      autor: "Paula Hawkins",
      preco: 29.90,
      capa: "assets/a_garota_no_trem_paula_hawkins.jpg"
    },
    "book-13": {
      titulo: "O Poder do Hábito",
      autor: "Charles Duhigg",
      preco: 34.90,
      capa: "assets/o_poder_do_habito.jpg"
    },
    "book-14": {
      titulo: "Pai Rico Pai Pobre",
      autor: "Robert Kiyosaki",
      preco: 37.50,
      capa: "assets/pai_rico_pai_pobre_robert_kiyosaki.jpg"
    },
    "book-15": {
      titulo: "Cem Anos de Solidão",
      autor: "Gabriel García Márquez",
      preco: 44.00,
      capa: "assets/cem_anos_de_solidão_gabriel_garcía_márquez.jpg"
    },
    "book-16": {
      titulo: "O Pequeno Príncipe",
      autor: "Antoine de Saint-Exupéry",
      preco: 19.90,
      capa: "assets/o_pequeno_príncipe_antoine_de_saintexupéry.jpg"
    },
    "book-17": {
      titulo: "Mulheres que Correm com os Lobos",
      autor: "Clarissa Pinkola Estés",
      preco: 48.00,
      capa: "assets/mulheres_que_correm_com_os_lobos_clarissa_pinkola_.jpg"
    },
    "book-18": {
      titulo: "A Sutil Arte de Ligar o Foda-se",
      autor: "Mark Manson",
      preco: 24.90,
      capa: "assets/a_sutil_arte_de_ligar_o_fodase_mark_manson.jpg"
    },
    "book-19": {
      titulo: "Os Sete Maridos de Evelyn Hugo",
      autor: "Taylor Jenkins Reid",
      preco: 39.90,
      capa: "assets/os_sete_maridos_de_evelyn_hugo_taylor_jenkins_reid.jpg"
    },
    "book-20": {
      titulo: "Mentirosos",
      autor: "E. Lockhart",
      preco: 22.00,
      capa: "assets/mentirosos_e_lockhart.jpg"
    },
    "book-21": {
      titulo: "É Assim que Acaba",
      autor: "Colleen Hoover",
      preco: 34.00,
      capa: "assets/é_assim_que_acaba_colleen_hoover.jpg"
    },
    "book-22": {
      titulo: "Amor e Gelato",
      autor: "Jenna Evans Welch",
      preco: 27.00,
      capa: "assets/amor_e_gelato_jenna_evans_welch.jpg"
    },
    "book-23": {
      titulo: "Rápido e Devagar",
      autor: "Daniel Kahneman",
      preco: 49.90,
      capa: "assets/rápido_e_devagar_daniel_kahneman.jpg"
    }
  };

  const container = document.getElementById('cart-page-container');
  let cart = {};
  let discountPercent = 0;
  let appliedCoupon = '';

  // Load from localStorage
  function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
      try {
        cart = JSON.parse(saved);
      } catch (e) {
        cart = {};
      }
    } else {
      cart = {};
    }
  }

  function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
    // Trigger standard script.js badge update by reloading badge element if script.js is loaded
    updateGlobalBadge();
  }

  function renderCart() {
    loadCart();

    // Check if cart has active items
    const cartItems = Object.entries(cart).filter(([id, qty]) => qty > 0);

    if (cartItems.length === 0) {
      renderEmptyState();
      return;
    }

    let subtotal = 0;
    let totalItems = 0;

    let itemsHtml = '';
    cartItems.forEach(([id, qty]) => {
      const book = LIVROS_DB[id];
      if (!book) return;

      const itemTotal = book.preco * qty;
      subtotal += itemTotal;
      totalItems += qty;

      itemsHtml += `
        <div class="box is-flex is-align-items-center mb-3 p-4 todo-item" data-id="${id}" style="gap: 1.25rem; flex-wrap: wrap;">
          <div style="width: 70px; min-width: 70px; height: 105px; aspect-ratio: 2/3; overflow: hidden; border-radius: 6px; box-shadow: 0 4px 10px rgba(0,0,0,0.15);">
            <img src="${book.capa}" alt="${book.titulo}" style="width: 100%; height: 100%; object-fit: cover;">
          </div>
          <div style="flex-grow: 1; min-width: 180px;">
            <h3 class="title is-6 font-serif mb-1 text-theme-override" style="font-size: 1.1rem; font-weight: 700; line-height: 1.2;">${book.titulo}</h3>
            <p class="subtitle is-7 mb-0 text-muted" style="font-size: 0.85rem;">${book.autor}</p>
          </div>
          <div class="has-text-right-tablet" style="min-width: 110px;">
            <span class="is-size-7 text-muted">Preço Unitário:</span>
            <p class="is-size-6 font-weight-bold" style="color: var(--color-accent-gold); font-size: 1rem;">R$ ${book.preco.toFixed(2).replace('.', ',')}</p>
          </div>
          <div class="is-flex is-align-items-center" style="gap: 0.75rem;">
            <button class="button is-small minus-item-btn" style="border-radius: 50%; width: 32px; height: 32px;">
              <i class="fa-solid fa-minus"></i>
            </button>
            <span class="font-weight-bold mx-2" style="font-size: 1.1rem;">${qty}</span>
            <button class="button is-small plus-item-btn" style="border-radius: 50%; width: 32px; height: 32px;">
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
          <div class="has-text-right" style="min-width: 110px;">
            <span class="is-size-7 text-muted">Subtotal:</span>
            <p class="is-size-6 font-weight-bold" style="color: var(--bulma-text); font-size: 1.05rem;">R$ ${itemTotal.toFixed(2).replace('.', ',')}</p>
          </div>
          <div>
            <button class="button is-danger is-light is-small delete-item-btn" aria-label="Remover item" style="width: 32px; height: 32px; border-radius: 50% !important; display: flex; align-items: center; justify-content: center;">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    });

    const discountAmount = subtotal * discountPercent;
    const finalTotal = subtotal - discountAmount;

    container.innerHTML = `
      <h1 class="title font-serif section-title mb-5"><i class="fa-solid fa-cart-shopping mr-2" style="color: var(--color-accent-gold);"></i>Seu Carrinho</h1>
      <div class="columns is-multiline">
        <!-- List of Items -->
        <div class="column is-12-mobile is-8-tablet">
          ${itemsHtml}
        </div>

        <!-- Summary Panel -->
        <div class="column is-12-mobile is-4-tablet">
          <div class="box p-4" style="background-color: var(--color-cream-card); border: 1.5px solid rgba(197, 168, 128, 0.2); border-radius: 12px;">
            <h2 class="title is-5 font-serif mb-4" style="color: var(--color-primary-brown-dark);">Resumo do Pedido</h2>
            
            <div class="is-flex is-justify-content-space-between mb-2">
              <span class="text-muted">Itens (${totalItems}):</span>
              <span>R$ ${subtotal.toFixed(2).replace('.', ',')}</span>
            </div>
            
            <div class="is-flex is-justify-content-space-between mb-2">
              <span class="text-muted">Frete:</span>
              <span class="has-text-success font-weight-bold">Grátis</span>
            </div>

            ${discountPercent > 0 ? `
            <div class="is-flex is-justify-content-space-between mb-2 has-text-success">
              <span>Desconto (Cupom ${appliedCoupon}):</span>
              <span>- R$ ${discountAmount.toFixed(2).replace('.', ',')}</span>
            </div>
            ` : ''}

            <hr style="background-color: rgba(197, 168, 128, 0.2); margin: 0.75rem 0;">

            <div class="is-flex is-justify-content-space-between is-align-items-center mb-5">
              <span class="title is-6 mb-0 font-serif">Total:</span>
              <span class="title is-5 mb-0 font-serif" style="color: var(--color-accent-gold);">R$ ${finalTotal.toFixed(2).replace('.', ',')}</span>
            </div>

            <!-- Coupon field -->
            <div class="field has-addons mb-4">
              <div class="control is-expanded">
                <input class="input is-small" type="text" id="coupon-input" placeholder="Possui cupom?" value="${appliedCoupon}" ${discountPercent > 0 ? 'disabled' : ''}>
              </div>
              <div class="control">
                <button class="button is-small" id="apply-coupon-btn" style="background-color: var(--color-accent-gold); color: white; border: none;" ${discountPercent > 0 ? 'disabled' : ''}>
                  Aplicar
                </button>
              </div>
            </div>
            <div id="coupon-message" class="is-size-7 mb-4" style="display: none;"></div>

            <button class="button is-fullwidth is-medium" id="btn-checkout" style="background-color: var(--color-primary-brown); color: white; border: none; font-weight: 600; border-radius: 8px;">
              <span>Finalizar Compra</span>
              <i class="fa-solid fa-arrow-right ml-2"></i>
            </button>
          </div>
        </div>
      </div>
    `;

    setupCartEvents();
    updateGlobalBadge(totalItems, finalTotal);
  }

  function renderEmptyState() {
    container.innerHTML = `
      <div class="has-text-centered py-6" style="min-height: 40vh; display: flex; flex-direction: column; justify-content: center; align-items: center;">
        <i class="fa-solid fa-cart-shopping fa-4x mb-4" style="color: var(--color-accent-gold); opacity: 0.5;"></i>
        <h1 class="title font-serif section-title mb-3">Seu Carrinho está Vazio</h1>
        <p class="subtitle is-6 mb-5 text-muted">Os itens selecionados no catálogo aparecerão aqui para finalizar a compra.</p>
        <a href="catalogo.html" class="button is-medium" style="background-color: var(--color-accent-gold); color: white; border: none; font-weight: 600; border-radius: 20px;">
          Voltar ao Catálogo
        </a>
      </div>
    `;
    updateGlobalBadge(0, 0);
  }

  function setupCartEvents() {
    const boxes = container.querySelectorAll('.todo-item');

    boxes.forEach(box => {
      const id = box.getAttribute('data-id');
      const minusBtn = box.querySelector('.minus-item-btn');
      const plusBtn = box.querySelector('.plus-item-btn');
      const deleteBtn = box.querySelector('.delete-item-btn');

      minusBtn.addEventListener('click', () => {
        if (cart[id] > 1) {
          cart[id]--;
          saveCart();
          renderCart();
        } else {
          removeBook(id);
        }
      });

      plusBtn.addEventListener('click', () => {
        cart[id]++;
        saveCart();
        renderCart();
      });

      deleteBtn.addEventListener('click', () => {
        removeBook(id);
      });
    });

    const applyCouponBtn = document.getElementById('apply-coupon-btn');
    if (applyCouponBtn) {
      applyCouponBtn.addEventListener('click', () => {
        const input = document.getElementById('coupon-input');
        const msg = document.getElementById('coupon-message');
        const code = input.value.trim().toUpperCase();

        if (code === 'RELIQUIA10') {
          discountPercent = 0.10;
          appliedCoupon = 'RELIQUIA10';
          msg.textContent = "Cupom de 10% aplicado com sucesso!";
          msg.style.color = "green";
          msg.style.display = "block";
          renderCart();
        } else if (code === '') {
          msg.style.display = "none";
        } else {
          msg.textContent = "Cupom inválido.";
          msg.style.color = "red";
          msg.style.display = "block";
        }
      });
    }

    const btnCheckout = document.getElementById('btn-checkout');
    if (btnCheckout) {
      btnCheckout.addEventListener('click', () => {
        alert("Compra finalizada com sucesso! Agradecemos a preferência pela Relíquia Escrita.");
        cart = {};
        discountPercent = 0;
        appliedCoupon = '';
        saveCart();
        renderCart();
      });
    }
  }

  function removeBook(id) {
    cart[id] = 0;
    saveCart();
    renderCart();
  }

  function updateGlobalBadge(totalItems, subtotal) {
    // Sync quantities and totals on the navbar cart badge
    const badge = document.getElementById('cart-badge');
    const subtotalFooter = document.getElementById('cart-subtotal-footer');
    const subtotalVal = document.getElementById('cart-subtotal-value');
    const cartTotalItemsSpan = document.getElementById('cart-total-items');

    if (totalItems === undefined) {
      // Calculate from cart
      totalItems = 0;
      subtotal = 0;
      for (const id in cart) {
        if (cart[id] > 0) {
          totalItems += cart[id];
          const book = LIVROS_DB[id];
          if (book) subtotal += cart[id] * book.preco;
        }
      }
      const discountAmount = subtotal * discountPercent;
      subtotal = subtotal - discountAmount;
    }

    if (badge) {
      if (totalItems > 0) {
        badge.textContent = totalItems;
        badge.style.display = 'inline-flex';
      } else {
        badge.style.display = 'none';
      }
    }

    if (cartTotalItemsSpan) {
      cartTotalItemsSpan.textContent = totalItems;
    }

    if (subtotalFooter) {
      if (totalItems > 0) {
        subtotalFooter.style.display = 'block';
        subtotalFooter.classList.add('is-active');
        if (subtotalVal) {
          subtotalVal.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
        }
      } else {
        subtotalFooter.classList.remove('is-active');
        subtotalFooter.style.display = 'none';
      }
    }
  }

  // Initial render
  renderCart();
});
