document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. Bulma Mobile Burger Menu Toggle
  // ==========================================================================
  const navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);
  
  if (navbarBurgers.length > 0) {
    navbarBurgers.forEach(el => {
      el.addEventListener('click', () => {
        const targetId = el.dataset.target;
        const targetElement = document.getElementById(targetId);
        
        // Toggle the "is-active" class on both the burger and the menu
        el.classList.toggle('is-active');
        targetElement.classList.toggle('is-active');
      });
    });
  }

  // ==========================================================================
  // 2. Dark Mode Toggle
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const toggleIcon = themeToggleBtn.querySelector('.toggle-icon');
  const htmlElement = document.documentElement;

  // Retrieve stored theme or fall back to system preferences
  const savedTheme = localStorage.getItem('theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const initialTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
  setTheme(initialTheme);

  themeToggleBtn.addEventListener('click', () => {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(theme) {
    htmlElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);

    if (theme === 'dark') {
      toggleIcon.classList.remove('fa-moon');
      toggleIcon.classList.add('fa-sun');
    } else {
      toggleIcon.classList.remove('fa-sun');
      toggleIcon.classList.add('fa-moon');
    }
  }

  // ==========================================================================
  // 3. Quantity Selector & Cart Management
  // ==========================================================================
  const cartBadge = document.getElementById('cart-badge');
  const cartSubtotalFooter = document.getElementById('cart-subtotal-footer');
  const cartSubtotalValue = document.getElementById('cart-subtotal-value');
  const bookCards = document.querySelectorAll('.book-card');
  
  // Track quantities and prices in memory
  const cart = {};
  const prices = {};

  // Retrieve stored cart from localStorage
  const savedCart = localStorage.getItem('cart');
  let parsedCart = {};
  if (savedCart) {
    try {
      parsedCart = JSON.parse(savedCart);
    } catch (e) {
      parsedCart = {};
    }
  }

  bookCards.forEach(card => {
    const bookId = card.getAttribute('data-id');
    const priceText = card.getAttribute('data-price');
    if (!bookId || !priceText) return;
    const priceNum = parseFloat(priceText.replace('R$ ', '').replace(',', '.'));
    const minusBtn = card.querySelector('.minus-btn');
    const plusBtn = card.querySelector('.plus-btn');
    
    // Initialize cart state for this book from parsedCart or 0
    cart[bookId] = parsedCart[bookId] || 0;
    prices[bookId] = priceNum || 0;

    // Display initial quantity
    updateQuantityDisplay(card, bookId);

    minusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (cart[bookId] > 0) {
        cart[bookId]--;
        updateQuantityDisplay(card, bookId);
        saveCartToStorage();
      }
    });

    plusBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      cart[bookId]++;
      updateQuantityDisplay(card, bookId);
      saveCartToStorage();
    });
  });

  function saveCartToStorage() {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  function updateQuantityDisplay(card, bookId) {
    const qty = cart[bookId];
    const qtyValue = card.querySelector('.quantity-value');
    const minusBtn = card.querySelector('.minus-btn');
    
    qtyValue.textContent = qty;
    
    if (qty > 0) {
      minusBtn.removeAttribute('disabled');
      card.classList.add('in-cart');
    } else {
      minusBtn.setAttribute('disabled', 'true');
      card.classList.remove('in-cart');
    }

    updateCartBadge();
  }

  function updateCartBadge() {
    let totalItems = 0;
    let subtotal = 0;
    for (const id in cart) {
      totalItems += cart[id];
      subtotal += cart[id] * prices[id];
    }

    if (totalItems > 0) {
      cartBadge.textContent = totalItems;
      cartBadge.style.display = 'inline-flex';
      
      if (cartSubtotalFooter) {
        cartSubtotalFooter.style.display = 'block';
        setTimeout(() => cartSubtotalFooter.classList.add('is-active'), 10);
        cartSubtotalValue.textContent = 'R$ ' + subtotal.toFixed(2).replace('.', ',');
      }
    } else {
      cartBadge.style.display = 'none';
      
      if (cartSubtotalFooter) {
        cartSubtotalFooter.classList.remove('is-active');
        setTimeout(() => {
          if (!cartSubtotalFooter.classList.contains('is-active')) {
            cartSubtotalFooter.style.display = 'none';
          }
        }, 400);
      }
    }
  }

  // ==========================================================================
  // 4. LGPD Cookie Banner
  // ==========================================================================
  const cookieBanner = document.getElementById('cookie-banner');
  const btnAcceptCookies = document.getElementById('accept-cookies');

  if (cookieBanner && btnAcceptCookies) {
    const hasAccepted = localStorage.getItem('cookies-accepted');
    if (!hasAccepted) {
      cookieBanner.style.display = 'block';
      setTimeout(() => cookieBanner.classList.add('is-active'), 100);
    }

    btnAcceptCookies.addEventListener('click', () => {
      localStorage.setItem('cookies-accepted', 'true');
      cookieBanner.classList.remove('is-active');
      setTimeout(() => {
        cookieBanner.style.display = 'none';
      }, 400);
    });
  }

  // ==========================================================================
  // 5. Configurações Globais (Cores e Fontes)
  // ==========================================================================
  
  // Aplicar configurações salvas ao carregar
  const savedScheme = localStorage.getItem('theme-scheme');
  const savedColor = localStorage.getItem('theme-color');

  if (savedScheme && savedScheme !== 'custom') {
    document.documentElement.setAttribute('data-color-scheme', savedScheme);
    document.documentElement.style.removeProperty('--color-accent-gold');
  } else if (savedColor) {
    document.documentElement.setAttribute('data-color-scheme', 'custom');
    document.documentElement.style.setProperty('--color-accent-gold', savedColor);
    const customPicker = document.getElementById('custom-color-picker');
    if (customPicker) customPicker.value = savedColor;
  }

  const savedFontSize = localStorage.getItem('theme-font-size');
  if (savedFontSize) {
    document.documentElement.style.fontSize = savedFontSize;
  }

  // Lógica da página de configurações
  const paletteBtns = document.querySelectorAll('.palette-btn');
  const customColorPicker = document.getElementById('custom-color-picker');
  const fontSizeBtns = document.querySelectorAll('.font-size-btn');

  // Highlight active saved color on load
  if (paletteBtns.length > 0) {
    const currentScheme = savedScheme || 'ouro';
    paletteBtns.forEach(btn => {
      if (btn.getAttribute('data-scheme') === currentScheme) {
        btn.classList.add('is-active');
      }
    });

    paletteBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        const button = e.currentTarget;
        const scheme = button.getAttribute('data-scheme');
        const color = button.getAttribute('data-color');
        
        document.documentElement.setAttribute('data-color-scheme', scheme);
        document.documentElement.style.removeProperty('--color-accent-gold');
        localStorage.setItem('theme-scheme', scheme);
        localStorage.setItem('theme-color', color);
        if (customColorPicker) customColorPicker.value = color;

        // Update active class
        paletteBtns.forEach(b => b.classList.remove('is-active'));
        button.classList.add('is-active');
      });
    });
  }

  if (customColorPicker) {
    customColorPicker.addEventListener('input', (e) => {
      const color = e.target.value;
      document.documentElement.setAttribute('data-color-scheme', 'custom');
      document.documentElement.style.setProperty('--color-accent-gold', color);
      localStorage.setItem('theme-scheme', 'custom');
      localStorage.setItem('theme-color', color);

      // Remove active class from predefined buttons since custom color is active
      paletteBtns.forEach(b => b.classList.remove('is-active'));
    });
  }

  if (fontSizeBtns.length > 0) {
    fontSizeBtns.forEach(btn => {
      // Set active visual state if matches saved
      if (savedFontSize && btn.getAttribute('data-size') === savedFontSize) {
        fontSizeBtns.forEach(b => b.classList.remove('is-active'));
        btn.classList.add('is-active');
      }

      btn.addEventListener('click', (e) => {
        const size = e.target.getAttribute('data-size');
        document.documentElement.style.fontSize = size;
        localStorage.setItem('theme-font-size', size);
        
        // Update visual state
        fontSizeBtns.forEach(b => b.classList.remove('is-active'));
        e.target.classList.add('is-active');
      });
    });
  }

  // ==========================================================================
  // 6. Navbar Scroll Dynamic Effect
  // ==========================================================================
  const mainNavbar = document.getElementById('main-navbar');
  if (mainNavbar) {
    const checkScroll = () => {
      if (window.scrollY > 20) {
        mainNavbar.classList.add('is-scrolled');
      } else {
        mainNavbar.classList.remove('is-scrolled');
      }
    };
    
    window.addEventListener('scroll', checkScroll);
    checkScroll();
  }

  // ==========================================================================
  // 7. CSRF Security Global Configuration & Session Verification
  // ==========================================================================
  function getCookie(name) {
    if (!document.cookie) return null;
    const xsrfCookies = document.cookie.split(';')
      .map(c => c.trim())
      .filter(c => c.startsWith(name + '='));
    if (xsrfCookies.length === 0) return null;
    return decodeURIComponent(xsrfCookies[0].substring(name.length + 1));
  }

  // Configure jQuery AJAX requests globally to send the CSRF token
  if (typeof $ !== 'undefined') {
    $.ajaxSetup({
      beforeSend: function (xhr, settings) {
        if (!/^(GET|HEAD|OPTIONS|TRACE)$/i.test(settings.type) && !this.crossDomain) {
          const csrftoken = getCookie('XSRF-TOKEN');
          if (csrftoken) {
            xhr.setRequestHeader("X-XSRF-TOKEN", csrftoken);
          }
        }
      }
    });
  }

  // Verify authentication status for private pages
  const isLoginPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || window.location.pathname === '';
  if (!isLoginPage) {
    fetch('/api/tarefas')
      .then(response => {
        if (response.status === 401) {
          window.location.href = 'index.html';
        }
      })
      .catch(() => {
        window.location.href = 'index.html';
      });
  }

  // Handle logout action
  const logoutBtn = document.getElementById('nav-logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      
      // CSRF header manually for fetch logout request
      const csrfToken = getCookie('XSRF-TOKEN');
      const headers = {};
      if (csrfToken) {
        headers['X-XSRF-TOKEN'] = csrfToken;
      }

      fetch('/perform_logout', { 
        method: 'POST',
        headers: headers
      })
      .then(() => {
        // Clear cart on logout to ensure clean state
        localStorage.removeItem('cart');
        window.location.href = 'index.html';
      })
      .catch(() => {
        window.location.href = 'index.html';
      });
    });
  }

});
