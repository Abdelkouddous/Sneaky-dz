import { formatCurrency } from '../utils/helpers.js';

export class ProductCard {
  /**
   * Generates HTML for a product card
   * @param {Object} product 
   * @returns {String} HTML string
   */
  static render(product) {
    const isNewHtml = product.isNew ? '<span class="badge badge--new">New</span>' : '';
    const isSaleHtml = product.isSale ? '<span class="badge badge--sale">Sale</span>' : '';
    
    let priceHtml = `<span class="product-card__price">${formatCurrency(product.price)}</span>`;
    if (product.oldPrice) {
      priceHtml += `<span class="product-card__price--old">${formatCurrency(product.oldPrice)}</span>`;
    }

    return `
      <div class="product-card">
        <a href="#/product/${product.id}" class="product-card__image-wrap">
          <div class="product-card__badges">
            ${isNewHtml}
            ${isSaleHtml}
          </div>
          <img src="${product.image}" alt="${product.name}" class="product-card__image" loading="lazy" decoding="async">
          <div class="product-card__actions" onclick="event.preventDefault(); event.stopPropagation();">
            <button class="product-card__action-btn btn-wishlist-toggle" data-id="${product.id}" aria-label="Add to Wishlist">
              <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
            <button class="product-card__action-btn btn-quick-add" data-id="${product.id}" aria-label="Quick Add">
              <svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
        </a>
        <a href="#/product/${product.id}" class="product-card__body">
          <div class="product-card__brand">${product.brand}</div>
          <h3 class="product-card__name">${product.name}</h3>
          <div class="product-card__rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>${product.rating}</span>
            <span class="product-card__rating-count">(${product.reviews})</span>
          </div>
          <div class="product-card__price-row">
            ${priceHtml}
          </div>
        </a>
      </div>
    `;
  }
}
