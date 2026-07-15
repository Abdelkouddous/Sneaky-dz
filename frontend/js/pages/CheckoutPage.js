import { store } from '../core/store.js';
import { formatCurrency } from '../utils/helpers.js';
import { validateInput, validators } from '../utils/validators.js';

export class CheckoutPage {
  constructor() {
    this.currentStep = 1;
    this.formData = {
      shipping: {},
      payment: {}
    };
  }

  async render() {
    const cart = store.getState().cart;
    if (cart.length === 0) {
      window.location.hash = '/cart';
      return '';
    }

    return `
      <div class="container checkout-page a-fade-in" id="checkout-container">
        <h1 class="u-mb-8 u-text-center">Checkout</h1>
        
        <div class="stepper">
          <div class="stepper__step stepper__step--active" id="step-1-ind">
            <div class="stepper__circle">1</div>
            <span class="stepper__label">Shipping</span>
          </div>
          <div class="stepper__line" id="line-1"></div>
          <div class="stepper__step" id="step-2-ind">
            <div class="stepper__circle">2</div>
            <span class="stepper__label">Payment</span>
          </div>
          <div class="stepper__line" id="line-2"></div>
          <div class="stepper__step" id="step-3-ind">
            <div class="stepper__circle">3</div>
            <span class="stepper__label">Review</span>
          </div>
        </div>

        <div class="checkout__layout">
          <!-- Forms Area -->
          <div class="checkout__content">
            <!-- Step 1: Shipping -->
            <form id="shipping-form" class="checkout-section">
              <h2 class="checkout-section__title">Shipping Address</h2>
              
              <div class="grid grid--2">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-input" name="firstName" required>
                  <div class="form-error">Required</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-input" name="lastName" required>
                  <div class="form-error">Required</div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" name="email" required>
                <div class="form-error">Valid email required</div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Address</label>
                <input type="text" class="form-input" name="address" required>
                <div class="form-error">Required</div>
              </div>
              
              <div class="grid grid--2">
                <div class="form-group">
                  <label class="form-label">City</label>
                  <input type="text" class="form-input" name="city" required>
                  <div class="form-error">Required</div>
                </div>
                <div class="form-group">
                  <label class="form-label">Postal Code</label>
                  <input type="text" class="form-input" name="zip" required>
                  <div class="form-error">Required</div>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Phone Number</label>
                <input type="tel" class="form-input" name="phone" required>
                <div class="form-error">Valid phone required</div>
              </div>

              <div class="checkout-actions" style="justify-content: flex-end;">
                <button type="submit" class="btn btn--primary">Continue to Payment</button>
              </div>
            </form>

            <!-- Step 2: Payment -->
            <form id="payment-form" class="checkout-section u-hidden">
              <h2 class="checkout-section__title">Payment Method</h2>
              
              <div class="payment-methods">
                <label class="payment-method payment-method--active">
                  <div class="payment-method__header">
                    <input type="radio" name="paymentType" value="card" class="form-check__input" checked>
                    <span class="u-font-bold">Credit / Debit Card</span>
                    <div class="payment-method__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>
                    </div>
                  </div>
                  <div class="payment-method__details">
                    <div class="form-group">
                      <label class="form-label">Card Number</label>
                      <input type="text" class="form-input" name="cardNumber" placeholder="0000 0000 0000 0000" maxlength="19">
                    </div>
                    <div class="grid grid--2">
                      <div class="form-group">
                        <label class="form-label">Expiry Date</label>
                        <input type="text" class="form-input" name="cardExpiry" placeholder="MM/YY" maxlength="5">
                      </div>
                      <div class="form-group">
                        <label class="form-label">CVC</label>
                        <input type="text" class="form-input" name="cardCvc" placeholder="123" maxlength="4">
                      </div>
                    </div>
                    <div class="form-group">
                      <label class="form-label">Name on Card</label>
                      <input type="text" class="form-input" name="cardName">
                    </div>
                  </div>
                </label>

                <label class="payment-method">
                  <div class="payment-method__header">
                    <input type="radio" name="paymentType" value="paypal" class="form-check__input">
                    <span class="u-font-bold">PayPal</span>
                    <div class="payment-method__icon">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 6.007 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.349 6.797-8.647 6.797h-2.19c-.524 0-.968.382-1.05.9l-1.12 7.106z"/></svg>
                    </div>
                  </div>
                  <div class="payment-method__details">
                    <p class="u-color-secondary">You will be redirected to PayPal to complete your purchase securely.</p>
                  </div>
                </label>
              </div>

              <div class="checkout-actions">
                <button type="button" class="btn btn--ghost" id="btn-back-1">Back</button>
                <button type="submit" class="btn btn--primary">Review Order</button>
              </div>
            </form>

            <!-- Step 3: Review -->
            <div id="review-section" class="checkout-section u-hidden">
              <h2 class="checkout-section__title">Review Your Order</h2>
              
              <div class="review-block">
                <div class="review-block__header">
                  <span class="review-block__title">Shipping Address</span>
                  <a href="#" class="review-block__edit" id="edit-shipping">Edit</a>
                </div>
                <div class="review-block__content" id="review-shipping-details">
                  <!-- Filled by JS -->
                </div>
              </div>

              <div class="review-block">
                <div class="review-block__header">
                  <span class="review-block__title">Payment Method</span>
                  <a href="#" class="review-block__edit" id="edit-payment">Edit</a>
                </div>
                <div class="review-block__content" id="review-payment-details">
                  <!-- Filled by JS -->
                </div>
              </div>

              <div class="order-mini-list" id="review-items">
                <!-- Filled by JS -->
              </div>

              <div class="checkout-actions" style="justify-content: flex-end;">
                <button type="button" class="btn btn--primary btn--lg" id="btn-place-order">Place Order</button>
              </div>
            </div>
            
            <!-- Success Message -->
            <div id="success-section" class="checkout-section u-hidden u-text-center" style="padding: var(--space-16) var(--space-8);">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="var(--color-success)" stroke-width="2" class="u-mb-6"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              <h2 class="u-mb-4">Order Confirmed!</h2>
              <p class="u-color-secondary u-mb-8">Thank you for your purchase. Your order number is <strong id="order-number" class="u-color-text"></strong>. We'll email you an order confirmation with details and tracking info.</p>
              <a href="#/dashboard" class="btn btn--primary">View Order Status</a>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div id="checkout-summary-wrap">
            <div class="cart-summary" id="checkout-summary">
              <!-- Rendered via JS -->
            </div>
          </div>
        </div>
      </div>
    `;
  }

  async afterRender() {
    this.renderSummary();
    this.bindEvents();
  }

  renderSummary() {
    const container = document.getElementById('checkout-summary');
    if (!container) return;
    
    const cart = store.getState().cart;
    const subtotal = store.getCartTotal();
    const shipping = subtotal > 2500000 ? 0 : 100000;
    const tax = Math.round(subtotal * 0.19);
    const total = subtotal + shipping + tax;

    container.innerHTML = `
      <h2 class="cart-summary__title">Order Summary</h2>
      <div class="cart-summary__row">
        <span>Items (${store.getCartCount()})</span>
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
    `;
  }

  renderReviewItems() {
    const container = document.getElementById('review-items');
    const cart = store.getState().cart;
    
    container.innerHTML = cart.map(item => `
      <div class="order-mini-item">
        <img src="${item.product.image}" alt="" class="order-mini-item__image">
        <div class="order-mini-item__info">
          <div class="order-mini-item__name">${item.product.name}</div>
          <div class="order-mini-item__meta">Size: ${item.size} | Color: <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${item.color};"></span> | Qty: ${item.quantity}</div>
        </div>
        <div class="order-mini-item__price">${formatCurrency(item.product.price * item.quantity)}</div>
      </div>
    `).join('');
  }

  setStep(step) {
    this.currentStep = step;
    
    // UI Updates
    document.getElementById('shipping-form').classList.toggle('u-hidden', step !== 1);
    document.getElementById('payment-form').classList.toggle('u-hidden', step !== 2);
    document.getElementById('review-section').classList.toggle('u-hidden', step !== 3);
    document.getElementById('success-section').classList.add('u-hidden');
    
    document.getElementById('checkout-summary-wrap').classList.remove('u-hidden');
    
    // Stepper updates
    for (let i = 1; i <= 3; i++) {
      const ind = document.getElementById(`step-${i}-ind`);
      const line = document.getElementById(`line-${i}`);
      
      if (ind) {
        ind.classList.remove('stepper__step--active', 'stepper__step--completed');
        if (i < step) ind.classList.add('stepper__step--completed');
        if (i === step) ind.classList.add('stepper__step--active');
      }
      
      if (line) {
        line.classList.toggle('stepper__line--active', i < step);
      }
    }
  }

  bindEvents() {
    // Payment method toggles
    const paymentRadios = document.querySelectorAll('input[name="paymentType"]');
    paymentRadios.forEach(radio => {
      radio.addEventListener('change', (e) => {
        document.querySelectorAll('.payment-method').forEach(m => m.classList.remove('payment-method--active'));
        e.target.closest('.payment-method').classList.add('payment-method--active');
      });
    });

    // Form 1 Submit
    document.getElementById('shipping-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Basic validation mock
      const fd = new FormData(e.target);
      this.formData.shipping = Object.fromEntries(fd.entries());
      
      document.getElementById('review-shipping-details').innerHTML = `
        ${this.formData.shipping.firstName} ${this.formData.shipping.lastName}<br>
        ${this.formData.shipping.address}<br>
        ${this.formData.shipping.city}, ${this.formData.shipping.zip}<br>
        ${this.formData.shipping.email} | ${this.formData.shipping.phone}
      `;
      
      this.setStep(2);
      window.scrollTo(0, 0);
    });

    // Back to 1
    document.getElementById('btn-back-1')?.addEventListener('click', () => {
      this.setStep(1);
    });

    // Form 2 Submit
    document.getElementById('payment-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      this.formData.payment = Object.fromEntries(fd.entries());
      
      const type = this.formData.payment.paymentType;
      const details = type === 'card' 
        ? `Card ending in ${(this.formData.payment.cardNumber || '****').slice(-4)}`
        : 'PayPal';
        
      document.getElementById('review-payment-details').innerHTML = `
        <div class="u-font-bold" style="text-transform: capitalize;">${type}</div>
        <div>${details}</div>
      `;
      
      this.renderReviewItems();
      this.setStep(3);
      window.scrollTo(0, 0);
    });

    // Edit buttons on review
    document.getElementById('edit-shipping')?.addEventListener('click', (e) => { e.preventDefault(); this.setStep(1); });
    document.getElementById('edit-payment')?.addEventListener('click', (e) => { e.preventDefault(); this.setStep(2); });

    // Place Order
    document.getElementById('btn-place-order')?.addEventListener('click', async (e) => {
      const btn = e.target;
      btn.classList.add('btn--loading');
      
      // Simulate API call
      import('../utils/helpers.js').then(async ({ wait }) => {
        await wait(1500);
        
        const orderId = store.placeOrder(this.formData.shipping, this.formData.payment);
        
        document.getElementById('review-section').classList.add('u-hidden');
        document.getElementById('checkout-summary-wrap').classList.add('u-hidden');
        document.getElementById('success-section').classList.remove('u-hidden');
        document.getElementById('order-number').textContent = orderId;
        
        document.querySelector('.stepper').style.display = 'none';
        window.scrollTo(0, 0);
      });
    });
  }
}
