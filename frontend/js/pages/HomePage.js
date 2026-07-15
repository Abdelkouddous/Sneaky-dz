import { getFeaturedProducts } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.js';

export class HomePage {
  async render() {
    return `
      <section class="hero a-fade-in">
        <div class="container">
          <div class="hero__content">
            <h1 class="hero__title">Step Into The Future of Footwear.</h1>
            <p class="hero__subtitle">Discover premium sneakers from top brands. Exclusive releases, classic silhouettes, and everything in between.</p>
            <div class="hero__actions">
              <a href="#/shop" class="btn btn--primary btn--lg">Shop Collection</a>
              <a href="#/shop/new" class="btn btn--secondary btn--lg">New Arrivals</a>
            </div>
            
            <div class="hero__stats">
              <div class="hero__stat">
                <span class="hero__stat-number">500+</span>
                <span class="hero__stat-label">Premium Sneakers</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">24h</span>
                <span class="hero__stat-label">Fast Delivery</span>
              </div>
              <div class="hero__stat">
                <span class="hero__stat-number">100%</span>
                <span class="hero__stat-label">Authentic Guarantee</span>
              </div>
            </div>
          </div>
        </div>
        <img src="assets/sneaker_hero_1783532812395.jpg" alt="Featured Sneaker" class="hero__image-wrap">
      </section>

      <section class="brands-strip">
        <div class="container">
          <div class="brands-strip__inner">
            <span class="brand-logo">NIKE</span>
            <span class="brand-logo">JORDAN</span>
            <span class="brand-logo">ADIDAS</span>
            <span class="brand-logo">NEW BALANCE</span>
            <span class="brand-logo">ASICS</span>
          </div>
        </div>
      </section>

      <section class="section container">
        <div class="section-header">
          <div>
            <h2 class="section-header__title">Trending Now</h2>
            <p class="u-color-secondary">The most sought-after styles this week.</p>
          </div>
          <a href="#/shop" class="btn btn--ghost">View All <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg></a>
        </div>
        <div class="product-grid" id="trending-grid">
          ${Array(4).fill('<div class="skeleton-card"><div class="skeleton skeleton--image"></div><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div></div>').join('')}
        </div>
      </section>

      <section class="section container">
        <div class="section-header">
          <div>
            <h2 class="section-header__title">Shop by Category</h2>
          </div>
        </div>
        <div class="category-grid">
          <a href="#/shop/men" class="category-card">
            <div class="category-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2a10 10 0 1 0 10 10H12V2Z"></path><path d="M12 2a10 10 0 0 1 10 10h-10V2Z"></path></svg>
            </div>
            <h3 class="category-card__title">Men's Collection</h3>
          </a>
          <a href="#/shop/women" class="category-card">
            <div class="category-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a10 10 0 1 0-10-10H12v10Z"></path><path d="M12 22a10 10 0 0 1-10-10h10v10Z"></path></svg>
            </div>
            <h3 class="category-card__title">Women's Collection</h3>
          </a>
          <a href="#/shop/lifestyle" class="category-card">
            <div class="category-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
            </div>
            <h3 class="category-card__title">Lifestyle</h3>
          </a>
          <a href="#/shop/running" class="category-card">
            <div class="category-card__icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M13 4v16"></path><path d="M17 4v16"></path><path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2z"></path></svg>
            </div>
            <h3 class="category-card__title">Running</h3>
          </a>
        </div>
      </section>

      <div class="container">
        <section class="sale-banner a-slide-up">
          <div class="sale-banner__content">
            <h2 class="sale-banner__title">End of Season Sale</h2>
            <p style="font-size: 1.25rem; margin-bottom: 2rem;">Up to 40% off selected styles.</p>
            <a href="#/shop/sale" class="btn btn--primary btn--lg" style="background: white; color: var(--color-accent);">Shop Sale</a>
          </div>
        </section>
      </div>
    `;
  }

  async afterRender() {
    const grid = document.getElementById('trending-grid');
    if (grid) {
      try {
        const products = await getFeaturedProducts();
        grid.innerHTML = products.map(p => ProductCard.render(p)).join('');
        
        // Setup wish list toggles for loaded cards
        import('../app.js').then(({ setupProductCards }) => {
          setupProductCards(grid);
        });
      } catch (e) {
        grid.innerHTML = '<p class="u-color-error">Failed to load trending products.</p>';
      }
    }
  }
}
