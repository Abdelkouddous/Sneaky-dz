import { Router } from './core/router.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';

// Pages
import { HomePage } from './pages/HomePage.js';
import { ShopPage } from './pages/ShopPage.js';
import { ProductPage } from './pages/ProductPage.js';
import { CartPage } from './pages/CartPage.js';
import { CheckoutPage } from './pages/CheckoutPage.js';
import { DashboardPage } from './pages/DashboardPage.js';
import { ContactPage } from './pages/ContactPage.js';
import { ErrorPage } from './pages/ErrorPage.js';
import { store } from './core/store.js';

const routes = [
  { path: '/', view: HomePage },
  { path: '/shop', view: ShopPage },
  { path: '/product', view: ProductPage },
  { path: '/cart', view: CartPage },
  { path: '/checkout', view: CheckoutPage },
  { path: '/dashboard', view: DashboardPage },
  { path: '/contact', view: ContactPage },
  { path: '/404', view: () => new ErrorPage(404) },
  { path: '/500', view: () => new ErrorPage(500) }
];

document.addEventListener('DOMContentLoaded', async () => {
  // Initialize Header & Footer
  const header = new Header();
  await header.render();
  
  const footer = new Footer();
  await footer.render();

  // Initialize Router
  new Router(routes);
});

// Global helpers for dynamically inserted HTML elements
export const setupProductCards = (container) => {
  container.querySelectorAll('.btn-wishlist-toggle').forEach(btn => {
    // Set initial state
    const id = btn.dataset.id;
    if (store.isInWishlist(id)) {
      btn.classList.add('active');
    }
    
    // Bind click
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isAdded = store.toggleWishlist(id);
      btn.classList.toggle('active', isAdded);
      
      import('./components/Toast.js').then(({ Toast }) => {
        Toast.show(isAdded ? 'Added to Wishlist' : 'Removed from Wishlist', 'success', 2000);
      });
    });
  });

  container.querySelectorAll('.btn-quick-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      const id = btn.dataset.id;
      btn.classList.add('btn--loading');
      
      import('./data/products.js').then(async ({ getProductById }) => {
        const product = await getProductById(id);
        if (product) {
          // Add default first size and color for quick add
          store.addToCart(product, 1, product.sizes[0], product.colors[0]);
          setTimeout(() => {
            btn.classList.remove('btn--loading');
            import('./components/Toast.js').then(({ Toast }) => {
              Toast.show('Added to cart', 'success', 2000);
            });
          }, 300);
        }
      });
    });
  });
};
