import { getProducts } from '../data/products.js';
import { ProductCard } from '../components/ProductCard.js';
import { wait } from '../utils/helpers.js';

export class ShopPage {
  constructor() {
    this.products = [];
    this.filteredProducts = [];
    this.filters = {
      brands: [],
      categories: [],
      priceRange: 50000
    };
  }

  async render(routeContext) {
    const filterCategory = routeContext.id; // e.g., 'men', 'women', 'sale'
    if (filterCategory) {
      if (['men', 'women'].includes(filterCategory)) {
        this.filters.gender = filterCategory;
      } else if (filterCategory === 'sale') {
        this.filters.isSale = true;
      }
    }

    return `
      <div class="container shop-page a-fade-in">
        <div class="shop__header">
          <h1 class="shop__title">Shop Sneakers</h1>
          <p class="shop__results-count" id="results-count">Loading...</p>
        </div>

        <div class="shop__toolbar">
          <div class="shop__toolbar-left">
            <button class="btn btn--secondary filter-toggle-btn" id="filter-toggle">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>
              Filters
            </button>
            <div class="active-filters" id="active-filters"></div>
          </div>
          <div class="shop__toolbar-right">
            <div class="form-group u-mb-0" style="min-width: 200px;">
              <select class="form-input" id="sort-select" aria-label="Sort products">
                <option value="featured">Sort by: Featured</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest Arrivals</option>
              </select>
            </div>
          </div>
        </div>

        <div class="shop__layout">
          <aside class="sidebar" id="shop-sidebar">
            <div class="sidebar__header sidebar-close">
              <span class="u-font-bold">Filters</span>
              <button class="btn btn--icon" id="filter-close"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
            </div>
            
            <div class="sidebar__header">
              <span class="u-font-bold">Filters</span>
              <button class="sidebar__clear-btn u-hidden" id="clear-filters">Clear All</button>
            </div>

            <div class="sidebar__section">
              <div class="sidebar__title">Brand</div>
              <div class="sidebar__content sidebar__list">
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-brand" value="Nike">
                  <span class="sidebar__label">Nike</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-brand" value="Jordan">
                  <span class="sidebar__label">Jordan</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-brand" value="Adidas">
                  <span class="sidebar__label">Adidas</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-brand" value="New Balance">
                  <span class="sidebar__label">New Balance</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-brand" value="Asics">
                  <span class="sidebar__label">Asics</span>
                </label>
              </div>
            </div>

            <div class="sidebar__section">
              <div class="sidebar__title">Category</div>
              <div class="sidebar__content sidebar__list">
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-category" value="lifestyle">
                  <span class="sidebar__label">Lifestyle</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-category" value="running">
                  <span class="sidebar__label">Running</span>
                </label>
                <label class="sidebar__option">
                  <input type="checkbox" class="sidebar__checkbox filter-category" value="basketball">
                  <span class="sidebar__label">Basketball</span>
                </label>
              </div>
            </div>
          </aside>
          
          <div class="sidebar-overlay" id="sidebar-overlay"></div>

          <div class="shop__content">
            <div class="product-grid" id="shop-grid">
              ${Array(8).fill('<div class="skeleton-card"><div class="skeleton skeleton--image"></div><div class="skeleton skeleton--title"></div><div class="skeleton skeleton--text"></div></div>').join('')}
            </div>
            
            <div class="pagination u-hidden" id="pagination">
              <button class="pagination__btn" disabled>&lt;</button>
              <button class="pagination__btn pagination__btn--active">1</button>
              <button class="pagination__btn">2</button>
              <button class="pagination__btn">&gt;</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    const grid = document.getElementById('shop-grid');
    const countEl = document.getElementById('results-count');
    
    try {
      // Simulate network request
      await wait(300);
      this.products = await getProducts();
      
      // Apply initial route filters if any
      this.applyFilters();
      this.bindEvents();
      
    } catch (e) {
      grid.innerHTML = `
        <div class="shop__empty" style="grid-column: 1/-1">
          <svg class="shop__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          <h3 class="shop__empty-title">Error loading products</h3>
          <p class="shop__empty-text">Please try again later.</p>
        </div>
      `;
      countEl.textContent = '0 results';
    }
  }

  renderGrid() {
    const grid = document.getElementById('shop-grid');
    const countEl = document.getElementById('results-count');
    
    countEl.textContent = `${this.filteredProducts.length} results`;
    
    if (this.filteredProducts.length === 0) {
      grid.innerHTML = `
        <div class="shop__empty" style="grid-column: 1/-1">
          <svg class="shop__empty-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <h3 class="shop__empty-title">No products found</h3>
          <p class="shop__empty-text">Try adjusting your filters or search criteria.</p>
          <button class="btn btn--secondary" id="empty-clear-filters">Clear All Filters</button>
        </div>
      `;
      document.getElementById('empty-clear-filters')?.addEventListener('click', () => {
        document.getElementById('clear-filters').click();
      });
      return;
    }

    grid.innerHTML = this.filteredProducts.map(p => ProductCard.render(p)).join('');
    
    // Setup components (wishlist, quick add)
    import('../app.js').then(({ setupProductCards }) => {
      setupProductCards(grid);
    });
  }

  applyFilters() {
    this.filteredProducts = this.products.filter(p => {
      let match = true;
      
      // Gender route filter
      if (this.filters.gender && p.gender !== this.filters.gender && p.gender !== 'unisex') {
        match = false;
      }
      // Sale route filter
      if (this.filters.isSale && !p.isSale) match = false;
      
      // Sidebar Brands
      if (this.filters.brands.length > 0 && !this.filters.brands.includes(p.brand)) match = false;
      
      // Sidebar Categories
      if (this.filters.categories.length > 0 && !this.filters.categories.includes(p.category)) match = false;
      
      return match;
    });

    this.applySort(document.getElementById('sort-select')?.value || 'featured');
  }

  applySort(sortValue) {
    switch (sortValue) {
      case 'price-asc':
        this.filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        this.filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        this.filteredProducts.sort((a, b) => (b.isNew === a.isNew) ? 0 : b.isNew ? 1 : -1);
        break;
      case 'featured':
      default:
        // Default sort logic
        break;
    }
    
    this.renderGrid();
  }

  bindEvents() {
    // Sort
    const sortSelect = document.getElementById('sort-select');
    sortSelect.addEventListener('change', (e) => this.applySort(e.target.value));

    // Filters logic
    const brandCheckboxes = document.querySelectorAll('.filter-brand');
    const categoryCheckboxes = document.querySelectorAll('.filter-category');
    const clearBtn = document.getElementById('clear-filters');

    const updateFilters = () => {
      this.filters.brands = Array.from(brandCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
      this.filters.categories = Array.from(categoryCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
      
      if (this.filters.brands.length > 0 || this.filters.categories.length > 0) {
        clearBtn.classList.remove('u-hidden');
      } else {
        clearBtn.classList.add('u-hidden');
      }
      
      this.applyFilters();
    };

    brandCheckboxes.forEach(cb => cb.addEventListener('change', updateFilters));
    categoryCheckboxes.forEach(cb => cb.addEventListener('change', updateFilters));

    clearBtn.addEventListener('click', () => {
      brandCheckboxes.forEach(cb => cb.checked = false);
      categoryCheckboxes.forEach(cb => cb.checked = false);
      updateFilters();
    });

    // Mobile Sidebar Toggle
    const sidebar = document.getElementById('shop-sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const toggleBtn = document.getElementById('filter-toggle');
    const closeBtn = document.getElementById('filter-close');

    const toggleSidebar = () => {
      sidebar.classList.toggle('sidebar--open');
      overlay.classList.toggle('sidebar-overlay--visible');
      document.body.style.overflow = sidebar.classList.contains('sidebar--open') ? 'hidden' : '';
    };

    toggleBtn?.addEventListener('click', toggleSidebar);
    closeBtn?.addEventListener('click', toggleSidebar);
    overlay?.addEventListener('click', toggleSidebar);
    
    // Collapsible sections
    document.querySelectorAll('.sidebar__title').forEach(title => {
      title.addEventListener('click', () => {
        title.parentElement.classList.toggle('sidebar__section--collapsed');
      });
    });
  }
}
