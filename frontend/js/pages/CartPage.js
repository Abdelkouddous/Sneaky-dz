import { store } from '../core/store.js';
import { formatCurrency } from '../utils/helpers.js';

export class CartPage {
  constructor() {
    this.unsubscribe = null;
  }

  async render() {
    return `
      <div class="container cart-page a-fade-in" id="cart-container">
        <!-- Rendered dynamically via afterRender -->
      </div>
    `;
  }

  async afterRender() {
    this.renderCart();
    this.unsubscribe = store.subscribe('cart', () => this.renderCart());
  }

  destroy() {
    if (this.unsubscribe) this.unsubscribe();
  }

  renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    
    const state = store.getState();
    const cart = state.cart;

    if (cart.length === 0) {
      container.innerHTML = `
        <div class="cart-empty">
          <svg class="cart-empty__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <h2 class="u-mb-2">Your cart is empty</h2>
          <p class="u-color-secondary u-mb-8">Looks like you haven't added anything yet.</p>
          <a href="#/shop" class="btn btn--primary btn--lg">Start Shopping</a>
        </div>
      `;
      return;
    }

    const subtotal = store.getCartTotal();
    const shipping = subtotal > 2500000 ? 0 : 100000; // Free shipping over 25,000 DA, else 1000 DA
    const tax = Math.round(subtotal * 0.19); // 19% TVA in Algeria
    const total = subtotal + shipping + tax;

    const itemsHtml = cart.map(item => {
      const p = item.product;
      return `
        <div class="cart-item">
          <a href="#/product/${p.id}" class="cart-item__image-wrap">
            <img src="${p.image}" alt="${p.name}" class="cart-item__image">
          </a>
          <div class="cart-item__info">
            <span class="cart-item__brand">${p.brand}</span>
            <a href="#/product/${p.id}" class="cart-item__name">${p.name}</a>
            <div class="cart-item__variants">
              <span>Size: EU ${item.size}</span>
              <span style="display: flex; align-items: center; gap: 4px;">Color: <span style="display:inline-block; width:12px; height:12px; border-radius:50%; background:${item.color}; border: 1px solid #ccc;"></span></span>
            </div>
            <div class="cart-item__price-wrap">
              <span class="cart-item__price">${formatCurrency(p.price)}</span>
            </div>
          </div>
          <div class="cart-item__actions">
            <div class="quantity-selector" style="height: 36px; border-color: var(--color-border-light);">
              <button class="quantity-selector__btn qty-btn" data-id="${item.id}" data-action="minus" aria-label="Decrease quantity">-</button>
              <span class="quantity-selector__value">${item.quantity}</span>
              <button class="quantity-selector__btn qty-btn" data-id="${item.id}" data-action="plus" aria-label="Increase quantity">+</button>
            </div>
            <button class="btn btn--ghost btn--sm cart-item__remove remove-btn" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `;
    }).join('');

    container.innerHTML = `
      <h1 class="u-mb-8">Your Cart (${store.getCartCount()} items)</h1>
      <div class="cart__layout">
        <div class="cart__items">
          ${itemsHtml}
        </div>
        
        <div>
          <div class="cart-summary">
            <h2 class="cart-summary__title">Order Summary</h2>
            
            <div class="promo-form form-input-group">
              <input type="text" class="form-input" placeholder="Promo Code">
              <button class="btn btn--secondary">Apply</button>
            </div>

            <div class="cart-summary__row">
              <span>Subtotal</span>
              <span>${formatCurrency(subtotal)}</span>
            </div>
            <div class="cart-summary__row">
              <span>Shipping</span>
              <span>${shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
            </div>
            <div class="cart-summary__row">
              <span>Estimated Tax</span>
              <span>${formatCurrency(tax)}</span>
            </div>
            
            <div class="cart-summary__total">
              <span>Total</span>
              <span>${formatCurrency(total)}</span>
            </div>
            
            <a href="#/checkout" class="btn btn--primary btn--full btn--lg">Proceed to Checkout</a>
            
            <div class="trust-badge">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const container = document.getElementById('cart-container');
    
    // Delegate events
    container.addEventListener('click', (e) => {
      // Quantity buttons
      if (e.target.closest('.qty-btn')) {
        const btn = e.target.closest('.qty-btn');
        const id = btn.dataset.id;
        const action = btn.dataset.action;
        const item = store.getState().cart.find(i => i.id === id);
        
        if (item) {
          if (action === 'plus') {
            const stock = item.product.stock[item.size] || 0;
            if (item.quantity < stock) {
              store.updateCartQuantity(id, item.quantity + 1);
            }
          } else {
            store.updateCartQuantity(id, item.quantity - 1);
          }
        }
      }
      
      // Remove button
      if (e.target.closest('.remove-btn')) {
        const btn = e.target.closest('.remove-btn');
        store.removeFromCart(btn.dataset.id);
        import('../components/Toast.js').then(({ Toast }) => {
          Toast.show('Item removed from cart', 'info');
        });
      }
    });
  }
}
