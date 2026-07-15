import { store } from '../core/store.js';
import { formatCurrency } from '../utils/helpers.js';

export class DashboardPage {
  constructor() {
    this.user = store.getState().user;
  }

  async render() {
    // Mock user if not logged in just for demo purposes
    if (!this.user) {
      store.login({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com'
      });
      this.user = store.getState().user;
    }

    const initials = `${this.user.firstName[0]}${this.user.lastName[0]}`;

    return `
      <div class="container dashboard-page a-fade-in">
        <div class="dashboard__layout">
          <!-- Sidebar -->
          <aside class="dashboard__sidebar">
            <div class="dashboard__profile">
              <div class="dashboard__avatar">${initials}</div>
              <div class="dashboard__name">${this.user.firstName} ${this.user.lastName}</div>
              <div class="dashboard__email">${this.user.email}</div>
            </div>
            
            <nav class="dashboard__nav">
              <button class="dashboard__nav-item dashboard__nav-item--active" data-tab="orders">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>
                My Orders
              </button>
              <button class="dashboard__nav-item" data-tab="wishlist">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                Wishlist
              </button>
              <button class="dashboard__nav-item" data-tab="settings">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
                Account Settings
              </button>
              <button class="dashboard__nav-item" id="btn-logout" style="margin-top: var(--space-4); color: var(--color-error);">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
                Log Out
              </button>
            </nav>
          </aside>

          <!-- Content -->
          <div class="dashboard__content">
            <!-- Orders Tab -->
            <div class="dashboard__tab-pane dashboard__tab-pane--active" id="tab-orders">
              <h2 class="dashboard__title">Order History</h2>
              <div id="orders-container"></div>
            </div>

            <!-- Wishlist Tab -->
            <div class="dashboard__tab-pane" id="tab-wishlist">
              <h2 class="dashboard__title">My Wishlist</h2>
              <div class="product-grid" id="wishlist-grid"></div>
            </div>

            <!-- Settings Tab -->
            <div class="dashboard__tab-pane" id="tab-settings">
              <h2 class="dashboard__title">Account Settings</h2>
              
              <div class="settings-section">
                <h3 class="settings-section__title">Personal Information</h3>
                <form id="profile-form">
                  <div class="grid grid--2">
                    <div class="form-group">
                      <label class="form-label">First Name</label>
                      <input type="text" class="form-input" value="${this.user.firstName}">
                    </div>
                    <div class="form-group">
                      <label class="form-label">Last Name</label>
                      <input type="text" class="form-input" value="${this.user.lastName}">
                    </div>
                  </div>
                  <div class="form-group">
                    <label class="form-label">Email Address</label>
                    <input type="email" class="form-input" value="${this.user.email}" readonly style="opacity: 0.7">
                  </div>
                  <button type="submit" class="btn btn--primary">Save Changes</button>
                </form>
              </div>

              <div class="settings-section">
                <h3 class="settings-section__title">Change Password</h3>
                <form id="password-form">
                  <div class="form-group">
                    <label class="form-label">Current Password</label>
                    <input type="password" class="form-input">
                  </div>
                  <div class="form-group">
                    <label class="form-label">New Password</label>
                    <input type="password" class="form-input">
                  </div>
                  <button type="submit" class="btn btn--secondary">Update Password</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.renderOrders();
    this.renderWishlist();
    this.bindEvents();
  }

  renderOrders() {
    const container = document.getElementById('orders-container');
    const orders = store.getState().orders;

    if (!orders || orders.length === 0) {
      container.innerHTML = `
        <div class="dashboard__empty">
          <p class="u-color-secondary u-mb-4">You haven't placed any orders yet.</p>
          <a href="#/shop" class="btn btn--primary">Start Shopping</a>
        </div>
      `;
      return;
    }

    container.innerHTML = orders.map(order => {
      const date = new Date(order.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      
      const itemsHtml = order.items.map(item => `
        <div class="order-mini-item">
          <img src="${item.product.image}" alt="" class="order-mini-item__image">
          <div class="order-mini-item__info">
            <div class="order-mini-item__name">${item.product.name}</div>
            <div class="order-mini-item__meta">Size: ${item.size} | Qty: ${item.quantity}</div>
          </div>
          <div class="order-mini-item__price">${formatCurrency(item.product.price * item.quantity)}</div>
        </div>
      `).join('');

      return `
        <div class="order-card">
          <div class="order-card__header">
            <div class="order-card__info">
              <div class="order-card__meta-item">
                <span class="order-card__meta-label">Order Placed</span>
                <span class="order-card__meta-value">${date}</span>
              </div>
              <div class="order-card__meta-item">
                <span class="order-card__meta-label">Total</span>
                <span class="order-card__meta-value">${formatCurrency(order.total)}</span>
              </div>
              <div class="order-card__meta-item">
                <span class="order-card__meta-label">Order #</span>
                <span class="order-card__meta-value">${order.id}</span>
              </div>
              <div class="order-card__meta-item">
                <span class="badge badge--status badge--status-${order.status}">${order.status}</span>
              </div>
            </div>
            <div class="order-card__toggle">
              Details
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="transition: transform 0.2s"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
          <div class="order-card__details">
            <div class="grid grid--2 u-mb-6">
              <div>
                <h4 class="u-mb-2">Shipping Address</h4>
                <p class="u-color-secondary" style="font-size: 0.875rem;">
                  ${order.shipping.firstName} ${order.shipping.lastName}<br>
                  ${order.shipping.address}<br>
                  ${order.shipping.city}, ${order.shipping.zip}
                </p>
              </div>
            </div>
            <h4 class="u-mb-3">Items</h4>
            <div class="order-mini-list">
              ${itemsHtml}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  async renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    const wishlistIds = store.getState().wishlist;
    
    if (wishlistIds.length === 0) {
      grid.innerHTML = `
        <div class="dashboard__empty" style="grid-column: 1/-1">
          <p class="u-color-secondary u-mb-4">Your wishlist is empty.</p>
          <a href="#/shop" class="btn btn--secondary">Discover Products</a>
        </div>
      `;
      return;
    }

    try {
      const { getProducts } = await import('../data/products.js');
      const allProducts = await getProducts();
      const wishlistProducts = allProducts.filter(p => wishlistIds.includes(p.id));
      
      const { ProductCard } = await import('../components/ProductCard.js');
      grid.innerHTML = wishlistProducts.map(p => ProductCard.render(p)).join('');
      
      const { setupProductCards } = await import('../app.js');
      setupProductCards(grid);

    } catch(e) {
      grid.innerHTML = '<p class="u-color-error">Failed to load wishlist.</p>';
    }
  }

  bindEvents() {
    // Tabs logic
    const tabs = document.querySelectorAll('.dashboard__nav-item[data-tab]');
    const panes = document.querySelectorAll('.dashboard__tab-pane');
    
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('dashboard__nav-item--active'));
        panes.forEach(p => p.classList.remove('dashboard__tab-pane--active'));
        
        tab.classList.add('dashboard__nav-item--active');
        document.getElementById(`tab-${tab.dataset.tab}`).classList.add('dashboard__tab-pane--active');
      });
    });

    // Accordion for orders
    const orderHeaders = document.querySelectorAll('.order-card__header');
    orderHeaders.forEach(header => {
      header.addEventListener('click', () => {
        header.closest('.order-card').classList.toggle('order-card--expanded');
      });
    });

    // Forms
    document.getElementById('profile-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      import('../components/Toast.js').then(({ Toast }) => Toast.show('Profile updated successfully', 'success'));
    });

    document.getElementById('password-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      e.target.reset();
      import('../components/Toast.js').then(({ Toast }) => Toast.show('Password changed successfully', 'success'));
    });

    // Logout
    document.getElementById('btn-logout')?.addEventListener('click', () => {
      store.logout();
      window.location.hash = '/';
      import('../components/Toast.js').then(({ Toast }) => Toast.show('Logged out successfully', 'info'));
    });
  }
}
