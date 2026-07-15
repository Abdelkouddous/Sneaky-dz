import { getProductById } from '../data/products.js';
import { store } from '../core/store.js';
import { formatCurrency, wait } from '../utils/helpers.js';
import { Toast } from '../components/Toast.js';

export class ProductPage {
  constructor() {
    this.product = null;
    this.selectedSize = null;
    this.selectedColor = null;
    this.quantity = 1;
  }

  async render(routeContext) {
    const id = routeContext.id;
    if (!id) {
      window.location.hash = '/shop';
      return '';
    }

    return `
      <div class="container product-detail a-fade-in" id="product-container">
        <div style="height: 60vh; display: flex; align-items: center; justify-content: center;">
          <div class="btn--loading" style="color: var(--color-text) !important; position: relative; width: 40px; height: 40px;"></div>
        </div>
      </div>
    `;
  }

  async afterRender(routeContext) {
    try {
      await wait(300); // Simulate network
      this.product = await getProductById(routeContext.id);
      
      if (!this.product) {
        document.getElementById('product-container').innerHTML = `
          <div class="u-text-center" style="padding: 100px 0;">
            <h2>Product Not Found</h2>
            <p class="u-color-secondary u-mt-4 u-mb-6">The product you're looking for doesn't exist.</p>
            <a href="#/shop" class="btn btn--primary">Back to Shop</a>
          </div>
        `;
        return;
      }

      this.selectedColor = this.product.colors[0];
      this.renderProduct();
    } catch (e) {
      console.error(e);
      window.location.hash = '/500';
    }
  }

  renderProduct() {
    const container = document.getElementById('product-container');
    const p = this.product;
    
    const sizeOptionsHtml = p.sizes.map(size => {
      const stock = p.stock[size] || 0;
      const isAvailable = stock > 0;
      const classNames = `size-option ${!isAvailable ? 'size-option--unavailable' : ''}`;
      return `<div class="${classNames}" data-size="${size}">${size}</div>`;
    }).join('');

    const colorOptionsHtml = p.colors.map(color => {
      const isActive = color === this.selectedColor ? 'color-swatch--active' : '';
      return `
        <div class="color-swatch ${isActive}" data-color="${color}">
          <span class="color-swatch__inner" style="background-color: ${color}"></span>
        </div>
      `;
    }).join('');

    let priceHtml = `<div class="product-detail__price ${p.isSale ? 'product-detail__price--sale' : ''}">${formatCurrency(p.price)}</div>`;
    if (p.oldPrice) {
      priceHtml += `<div class="product-detail__price--old">${formatCurrency(p.oldPrice)}</div>`;
    }

    container.innerHTML = `
      <nav class="breadcrumb">
        <a href="#/" class="breadcrumb__link">Home</a>
        <span class="breadcrumb__separator">/</span>
        <a href="#/shop" class="breadcrumb__link">Shop</a>
        <span class="breadcrumb__separator">/</span>
        <span style="color: var(--color-text)">${p.name}</span>
      </nav>

      <div class="product-detail__layout">
        <!-- Gallery -->
        <div class="gallery">
          <div class="gallery__thumbs">
            <div class="gallery__thumb gallery__thumb--active"><img src="${p.image}" alt=""></div>
            <div class="gallery__thumb"><img src="${p.image}" alt="" style="filter: hue-rotate(90deg)"></div>
            <div class="gallery__thumb"><img src="${p.image}" alt="" style="filter: grayscale(1)"></div>
          </div>
          <div class="gallery__main">
            <img src="${p.image}" alt="${p.name}" class="gallery__main-image" id="main-image">
            <div style="position: absolute; top: var(--space-4); left: var(--space-4); display: flex; flex-direction: column; gap: var(--space-2);">
              ${p.isNew ? '<span class="badge badge--new">New</span>' : ''}
              ${p.isSale ? '<span class="badge badge--sale">Sale</span>' : ''}
            </div>
          </div>
        </div>

        <!-- Info -->
        <div class="product-detail__info">
          <a href="#/shop" class="product-detail__brand">${p.brand}</a>
          <h1 class="product-detail__title">${p.name}</h1>
          
          <div class="product-detail__rating-row">
            <div style="display: flex; color: var(--color-warning);">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            </div>
            <span class="u-color-secondary">${p.rating} (${p.reviews} Reviews)</span>
          </div>

          <div class="product-detail__price-row">
            ${priceHtml}
          </div>

          <p class="product-detail__desc">${p.description}</p>

          <div class="product-option">
            <div class="product-option__header">
              <span class="product-option__title">Color</span>
              <span class="product-option__value" id="color-val">${this.selectedColor}</span>
            </div>
            <div class="color-swatches">
              ${colorOptionsHtml}
            </div>
          </div>

          <div class="product-option">
            <div class="product-option__header">
              <span class="product-option__title">Select Size (EU)</span>
              <a href="#" class="u-color-secondary u-font-medium" style="font-size: 0.875rem; text-decoration: underline;">Size Guide</a>
            </div>
            <div class="size-selector" id="size-selector">
              ${sizeOptionsHtml}
            </div>
            <div class="form-error u-mt-2" id="size-error">Please select a size</div>
          </div>

          <div class="product-detail__actions">
            <div class="quantity-selector">
              <button class="quantity-selector__btn" id="qty-minus" aria-label="Decrease quantity">-</button>
              <span class="quantity-selector__value" id="qty-val">${this.quantity}</span>
              <button class="quantity-selector__btn" id="qty-plus" aria-label="Increase quantity">+</button>
            </div>
            
            <button class="btn btn--primary btn--full" id="btn-add-cart">Add to Cart</button>
            
            <button class="btn btn--secondary btn-wishlist ${store.isInWishlist(p.id) ? 'active' : ''}" id="btn-wishlist">
              <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
            </button>
          </div>

          <div class="product-features">
            <div class="feature-item">
              <svg class="feature-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
              <span class="feature-item__text">Free Delivery</span>
            </div>
            <div class="feature-item">
              <svg class="feature-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></svg>
              <span class="feature-item__text">100% Authentic</span>
            </div>
            <div class="feature-item">
              <svg class="feature-item__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M2.13 15.57a9 9 0 1 0 3.87-11.53L2 6"></path></svg>
              <span class="feature-item__text">30 Days Return</span>
            </div>
          </div>
        </div>
      </div>
    `;

    this.bindEvents();
  }

  bindEvents() {
    // Gallery Image Zoom
    const mainImg = document.getElementById('main-image');
    if (mainImg) {
      mainImg.parentElement.addEventListener('mousemove', (e) => {
        const { left, top, width, height } = e.target.getBoundingClientRect();
        const x = (e.clientX - left) / width * 100;
        const y = (e.clientY - top) / height * 100;
        mainImg.style.transformOrigin = `${x}% ${y}%`;
        mainImg.style.transform = 'scale(2)';
      });
      mainImg.parentElement.addEventListener('mouseleave', () => {
        mainImg.style.transform = 'scale(1)';
        mainImg.style.transformOrigin = 'center center';
      });
    }

    // Size Selection
    const sizeOpts = document.querySelectorAll('.size-option:not(.size-option--unavailable)');
    const sizeError = document.getElementById('size-error');
    
    sizeOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        sizeOpts.forEach(o => o.classList.remove('size-option--active'));
        opt.classList.add('size-option--active');
        this.selectedSize = parseInt(opt.dataset.size, 10);
        sizeError.style.display = 'none';
      });
    });

    // Color Selection
    const colorOpts = document.querySelectorAll('.color-swatch');
    const colorVal = document.getElementById('color-val');
    
    colorOpts.forEach(opt => {
      opt.addEventListener('click', () => {
        colorOpts.forEach(o => o.classList.remove('color-swatch--active'));
        opt.classList.add('color-swatch--active');
        this.selectedColor = opt.dataset.color;
        if(colorVal) colorVal.textContent = this.selectedColor;
      });
    });

    // Quantity
    const qtyMinus = document.getElementById('qty-minus');
    const qtyPlus = document.getElementById('qty-plus');
    const qtyVal = document.getElementById('qty-val');

    qtyMinus?.addEventListener('click', () => {
      if (this.quantity > 1) {
        this.quantity--;
        qtyVal.textContent = this.quantity;
      }
    });

    qtyPlus?.addEventListener('click', () => {
      if (!this.selectedSize) {
        Toast.show('Please select a size first to check stock limit', 'info');
        return;
      }
      const stock = this.product.stock[this.selectedSize];
      if (this.quantity < stock) {
        this.quantity++;
        qtyVal.textContent = this.quantity;
      } else {
        Toast.show('Max stock reached for this size', 'info');
      }
    });

    // Add to Cart
    const addCartBtn = document.getElementById('btn-add-cart');
    addCartBtn?.addEventListener('click', () => {
      if (!this.selectedSize) {
        sizeError.style.display = 'block';
        // Shake animation
        const sizeContainer = document.getElementById('size-selector');
        sizeContainer.style.transform = 'translateX(-10px)';
        setTimeout(() => sizeContainer.style.transform = 'translateX(10px)', 100);
        setTimeout(() => sizeContainer.style.transform = 'translateX(0)', 200);
        return;
      }

      addCartBtn.classList.add('btn--loading');
      
      setTimeout(() => {
        store.addToCart(this.product, this.quantity, this.selectedSize, this.selectedColor);
        addCartBtn.classList.remove('btn--loading');
        Toast.show('Added to cart successfully!', 'success');
      }, 500); // Simulate processing
    });

    // Wishlist Toggle
    const wishlistBtn = document.getElementById('btn-wishlist');
    wishlistBtn?.addEventListener('click', () => {
      const isAdded = store.toggleWishlist(this.product.id);
      wishlistBtn.classList.toggle('active', isAdded);
      Toast.show(isAdded ? 'Added to Wishlist' : 'Removed from Wishlist', 'success');
    });
  }
}
