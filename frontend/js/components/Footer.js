export class Footer {
  constructor() {
    this.container = document.getElementById('footer-container');
  }

  async render() {
    this.container.innerHTML = `
      <footer class="footer">
        <div class="footer__grid">
          <div class="footer__col">
            <h3 class="footer__title">Sneaky DZ</h3>
            <p class="footer__text">Your premium destination for the latest and greatest sneakers. We provide authentic footwear from the world's top brands.</p>
            <div class="footer__social">
              <a href="#" class="footer__social-link" aria-label="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
              </a>
              <a href="#" class="footer__social-link" aria-label="Twitter">
                <svg viewBox="0 0 24 24"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
              </a>
              <a href="#" class="footer__social-link" aria-label="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
              </a>
            </div>
          </div>
          
          <div class="footer__col">
            <h3 class="footer__title">Shop</h3>
            <div class="footer__list">
              <a href="#/shop/men" class="footer__link">Men's Sneakers</a>
              <a href="#/shop/women" class="footer__link">Women's Sneakers</a>
              <a href="#/shop/new" class="footer__link">New Arrivals</a>
              <a href="#/shop/sale" class="footer__link">Sale & Offers</a>
            </div>
          </div>
          
          <div class="footer__col">
            <h3 class="footer__title">Help & Support</h3>
            <div class="footer__list">
              <a href="#/contact" class="footer__link">Contact Us</a>
              <a href="#/faq" class="footer__link">FAQ</a>
              <a href="#/shipping" class="footer__link">Shipping Info</a>
              <a href="#/returns" class="footer__link">Returns & Exchanges</a>
            </div>
          </div>
          
          <div class="footer__col">
            <h3 class="footer__title">Newsletter</h3>
            <p class="footer__text">Subscribe to get special offers, free giveaways, and once-in-a-lifetime deals.</p>
            <form class="footer__newsletter" id="footer-newsletter">
              <div class="form-input-group">
                <input type="email" class="form-input" placeholder="Enter your email" required aria-label="Email Address">
                <button type="submit" class="btn btn--primary">Subscribe</button>
              </div>
            </form>
          </div>
        </div>
        
        <div class="footer__bottom">
          <div class="footer__copyright">
            &copy; ${new Date().getFullYear()} Sneaky DZ. All rights reserved.
          </div>
          <div class="footer__payments">
            <div class="footer__payment-icon">VISA</div>
            <div class="footer__payment-icon">MC</div>
            <div class="footer__payment-icon">AMEX</div>
            <div class="footer__payment-icon">PP</div>
          </div>
        </div>
      </footer>
    `;

    this.bindEvents();
  }

  bindEvents() {
    const form = this.container.querySelector('#footer-newsletter');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        import('./Toast.js').then(({ Toast }) => {
          Toast.show('Subscribed to newsletter successfully!', 'success');
        });
        form.reset();
      });
    }
  }
}
