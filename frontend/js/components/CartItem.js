// @ts-nocheck
import { updateQuantity, removeFromCart } from '../store.js';
import { formatPrice } from '../utils/helpers.js';

const ICONS = {
  minus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  plus: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`,
  trash: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>`,
};

/**
 * Renders a single cart item row.
 * @param {Object} item - Cart item object { id, productId, name, brand, image, price_cents, sale_price_cents, size, color, quantity }
 * @returns {string} Cart item HTML string
 */
export function renderCartItem(item) {
  const unitPrice = item.sale_price_cents && item.sale_price_cents < item.price_cents
    ? item.sale_price_cents
    : item.price_cents;
  const subtotal = unitPrice * item.quantity;

  return `
<div class="cart-item" data-cart-item-id="${item.id}">
  <div class="cart-item__image">
    <img src="${item.image}" alt="${item.name}" loading="lazy">
  </div>
  <div class="cart-item__details">
    <div class="cart-item__info">
      <span class="cart-item__brand">${item.brand}</span>
      <h4 class="cart-item__name">
        <a href="#/product/${item.productId}">${item.name}</a>
      </h4>
      <div class="cart-item__meta">
        ${item.size && item.size !== 'N/A' ? `<span class="cart-item__meta-item">Size: ${item.size}</span>` : ''}
        ${item.color && item.color !== 'N/A' ? `<span class="cart-item__meta-item">Color: ${item.color}</span>` : ''}
      </div>
      <div class="cart-item__price">
        <span class="cart-item__unit-price">${formatPrice(unitPrice)}</span>
        ${item.sale_price_cents && item.sale_price_cents < item.price_cents
          ? `<span class="cart-item__original-price">${formatPrice(item.price_cents)}</span>`
          : ''}
      </div>
    </div>
    <div class="cart-item__controls">
      <div class="cart-item__quantity">
        <button class="cart-item__qty-btn cart-item__qty-btn--minus" data-cart-item-id="${item.id}" data-qty="${item.quantity}" aria-label="Decrease quantity">
          ${ICONS.minus}
        </button>
        <span class="cart-item__qty-value">${item.quantity}</span>
        <button class="cart-item__qty-btn cart-item__qty-btn--plus" data-cart-item-id="${item.id}" data-qty="${item.quantity}" aria-label="Increase quantity">
          ${ICONS.plus}
        </button>
      </div>
      <button class="cart-item__remove" data-cart-item-id="${item.id}" aria-label="Remove item">
        ${ICONS.trash}
      </button>
    </div>
    <div class="cart-item__subtotal">
      <span class="cart-item__subtotal-label">Subtotal:</span>
      <span class="cart-item__subtotal-value">${formatPrice(subtotal)}</span>
    </div>
  </div>
</div>`;
}

/**
 * Initializes event delegation for cart item controls.
 * Handles quantity increment/decrement and item removal.
 */
export function initCartItems() {
  document.addEventListener('click', (e) => {
    // Plus button
    const plusBtn = e.target.closest('.cart-item__qty-btn--plus');
    if (plusBtn) {
      const itemId = plusBtn.getAttribute('data-cart-item-id');
      const currentQty = parseInt(plusBtn.getAttribute('data-qty'), 10);
      if (itemId) {
        updateQuantity(itemId, currentQty + 1);
      }
      return;
    }

    // Minus button
    const minusBtn = e.target.closest('.cart-item__qty-btn--minus');
    if (minusBtn) {
      const itemId = minusBtn.getAttribute('data-cart-item-id');
      const currentQty = parseInt(minusBtn.getAttribute('data-qty'), 10);
      if (itemId) {
        const newQty = currentQty - 1;
        if (newQty <= 0) {
          removeFromCart(itemId);
        } else {
          updateQuantity(itemId, newQty);
        }
      }
      return;
    }

    // Remove button
    const removeBtn = e.target.closest('.cart-item__remove');
    if (removeBtn) {
      const itemId = removeBtn.getAttribute('data-cart-item-id');
      if (itemId) {
        removeFromCart(itemId);
      }
      return;
    }
  });
}
