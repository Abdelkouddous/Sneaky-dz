import { store } from '../core/store.js';

export class Header {
  constructor() {
    this.container = document.getElementById('header-container');
    this.unsubscribeCart = null;
    this.unsubscribeTheme = null;
  }

  async render() {
    this.container.innerHTML = `
      <header class="header">
        <div class="header__inner">
          <a href="#/" class="header__logo">Sneaky <span style="color: var(--color-accent);">DZ</span></a>
          
          <nav class="header__nav" aria-label="Main Navigation">
            <a href="#/" class="header__nav-link">Home</a>
            <a href="#/shop" class="header__nav-link">Shop</a>
            <a href="#/shop/men" class="header__nav-link">Men</a>
            <a href="#/shop/women" class="header__nav-link">Women</a>
            <a href="#/contact" class="header__nav-link">Contact</a>
          </nav>

          <div class="header__actions">
            <button class="header__action-btn" aria-label="Search" id="header-search-btn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
            </button>
            <a href="#/dashboard" class="header__action-btn" aria-label="Account">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            </a>
            <a href="#/cart" class="header__action-btn" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
              <span class="header__badge" id="cart-count">0</span>
            </a>
            <button class="header__action-btn" id="theme-toggle" aria-label="Toggle Theme">
              <!-- Icon injected by JS based on theme -->
            </button>
            <button class="header__hamburger" id="mobile-menu-btn" aria-label="Open Menu">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            </button>
          </div>
        </div>
      </header>

      <!-- Mobile Nav -->
      <div class="mobile-nav" id="mobile-nav" aria-hidden="true">
        <button class="mobile-nav__close" id="mobile-menu-close" aria-label="Close Menu">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
        <a href="#/" class="mobile-nav__link">Home</a>
        <a href="#/shop" class="mobile-nav__link">Shop All</a>
        <a href="#/shop/men" class="mobile-nav__link">Men</a>
        <a href="#/shop/women" class="mobile-nav__link">Women</a>
        <a href="#/contact" class="mobile-nav__link">Contact</a>
        <button class="btn btn--secondary u-mt-auto" id="mobile-theme-toggle">
          Toggle Dark Mode
        </button>
      </div>
    `;

    this.bindEvents();
    this.updateCartCount(store.getState().cart);
    this.updateThemeIcon(store.getState().theme);

    // Subscribe to state changes
    this.unsubscribeCart = store.subscribe('cart', (cart) => this.updateCartCount(cart));
    this.unsubscribeTheme = store.subscribe('theme', (theme) => this.updateThemeIcon(theme));
  }

  bindEvents() {
    // Active link highlighting
    const updateActiveLink = () => {
      const hash = window.location.hash || '#/';
      const links = this.container.querySelectorAll('.header__nav-link');
      links.forEach(link => {
        if (link.getAttribute('href') === hash) {
          link.classList.add('header__nav-link--active');
        } else {
          link.classList.remove('header__nav-link--active');
        }
      });
    };
    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink(); // Initial setup

    // Theme toggles
    const themeToggle = this.container.querySelector('#theme-toggle');
    const mobileThemeToggle = this.container.querySelector('#mobile-theme-toggle');
    const handleThemeToggle = () => store.toggleTheme();
    themeToggle?.addEventListener('click', handleThemeToggle);
    mobileThemeToggle?.addEventListener('click', handleThemeToggle);

    // Mobile Menu
    const menuBtn = this.container.querySelector('#mobile-menu-btn');
    const menuClose = this.container.querySelector('#mobile-menu-close');
    const mobileNav = this.container.querySelector('#mobile-nav');
    const mobileLinks = this.container.querySelectorAll('.mobile-nav__link');

    const openMenu = () => {
      mobileNav.classList.add('mobile-nav--open');
      mobileNav.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
      mobileNav.classList.remove('mobile-nav--open');
      mobileNav.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    menuBtn?.addEventListener('click', openMenu);
    menuClose?.addEventListener('click', closeMenu);
    mobileLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  updateCartCount(cart) {
    const countElement = this.container.querySelector('#cart-count');
    if (countElement) {
      const count = cart.reduce((total, item) => total + item.quantity, 0);
      countElement.textContent = count;
      countElement.style.display = count > 0 ? 'flex' : 'none';
      
      // Animate badge
      countElement.style.transform = 'scale(1.2)';
      setTimeout(() => { countElement.style.transform = 'scale(1)'; }, 200);
    }
  }

  updateThemeIcon(theme) {
    const btn = this.container.querySelector('#theme-toggle');
    if (btn) {
      if (theme === 'dark') {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      } else {
        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      }
    }
  }
}
