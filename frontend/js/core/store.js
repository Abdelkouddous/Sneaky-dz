import { generateUUID } from '../utils/helpers.js';

class Store {
  constructor() {
    this.state = {
      cart: [],
      wishlist: [],
      user: null,
      theme: 'dark',
      orders: []
    };
    
    this.listeners = new Map();
    this.init();
  }

  init() {
    const savedState = localStorage.getItem('sneakydz_state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        this.state = { ...this.state, ...parsed };
      } catch (e) {
        console.error('Failed to parse state from localStorage');
      }
    }
    
    // Apply theme: dark is default (no attribute), light needs explicit attribute
    if (this.state.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Pub/Sub Methods
  subscribe(key, callback) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key).add(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(key);
      if (callbacks) {
        callbacks.delete(callback);
      }
    };
  }

  notify(key, data) {
    const callbacks = this.listeners.get(key);
    if (callbacks) {
      callbacks.forEach(cb => cb(data));
    }
    this.persist();
  }

  persist() {
    localStorage.setItem('sneakydz_state', JSON.stringify(this.state));
  }

  // Getters
  getState() {
    return { ...this.state };
  }

  // Actions: Cart
  addToCart(product, quantity = 1, size, color) {
    const existingIndex = this.state.cart.findIndex(
      item => item.product.id === product.id && item.size === size && item.color === color
    );

    if (existingIndex > -1) {
      this.state.cart[existingIndex].quantity += quantity;
    } else {
      this.state.cart.push({
        id: generateUUID(),
        product,
        quantity,
        size,
        color,
        addedAt: Date.now()
      });
    }

    this.notify('cart', this.state.cart);
    return true;
  }

  removeFromCart(cartItemId) {
    this.state.cart = this.state.cart.filter(item => item.id !== cartItemId);
    this.notify('cart', this.state.cart);
  }

  updateCartQuantity(cartItemId, quantity) {
    if (quantity <= 0) {
      this.removeFromCart(cartItemId);
      return;
    }
    
    const item = this.state.cart.find(i => i.id === cartItemId);
    if (item) {
      item.quantity = quantity;
      this.notify('cart', this.state.cart);
    }
  }

  clearCart() {
    this.state.cart = [];
    this.notify('cart', this.state.cart);
  }

  getCartTotal() {
    return this.state.cart.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }

  getCartCount() {
    return this.state.cart.reduce((count, item) => count + item.quantity, 0);
  }

  // Actions: Wishlist
  toggleWishlist(productId) {
    const index = this.state.wishlist.indexOf(productId);
    let added = false;
    
    if (index > -1) {
      this.state.wishlist.splice(index, 1);
    } else {
      this.state.wishlist.push(productId);
      added = true;
    }
    
    this.notify('wishlist', this.state.wishlist);
    return added;
  }

  isInWishlist(productId) {
    return this.state.wishlist.includes(productId);
  }

  // Actions: User
  login(userData) {
    this.state.user = {
      id: generateUUID(),
      ...userData,
      memberSince: Date.now()
    };
    this.notify('user', this.state.user);
  }

  logout() {
    this.state.user = null;
    this.notify('user', this.state.user);
  }

  // Actions: Orders
  placeOrder(shippingDetails, paymentDetails) {
    const order = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      items: [...this.state.cart],
      total: this.getCartTotal(),
      status: 'processing',
      date: Date.now(),
      shipping: shippingDetails
    };
    
    this.state.orders.unshift(order); // Add to beginning
    this.notify('orders', this.state.orders);
    this.clearCart();
    
    return order.id;
  }

  // Actions: Theme
  toggleTheme() {
    this.state.theme = this.state.theme === 'dark' ? 'light' : 'dark';
    if (this.state.theme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    this.notify('theme', this.state.theme);
    return this.state.theme;
  }
}

// Export singleton instance
export const store = new Store();
