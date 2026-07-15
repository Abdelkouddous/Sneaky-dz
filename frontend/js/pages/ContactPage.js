export class ContactPage {
  async render() {
    return `
      <div class="container contact-page a-fade-in">
        <h1 class="u-mb-8 u-text-center">Contact Us</h1>
        
        <div class="contact__layout">
          <div>
            <div class="contact__info">
              <h2 class="contact__title">Get in Touch</h2>
              <p class="contact__desc">Have a question about an order, our products, or just want to say hi? We'd love to hear from you.</p>
              
              <div class="contact__details">
                <div class="contact__detail-item">
                  <div class="contact__icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  </div>
                  <div>
                    <div class="contact__detail-title">Phone</div>
                    <div class="contact__detail-text">+213 555 123 456</div>
                    <div class="contact__detail-text u-color-secondary" style="font-size: 0.8125rem;">Mon-Fri, 9am - 6pm</div>
                  </div>
                </div>
                
                <div class="contact__detail-item">
                  <div class="contact__icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                  </div>
                  <div>
                    <div class="contact__detail-title">Email</div>
                    <div class="contact__detail-text">support@sneakydz.com</div>
                  </div>
                </div>
                
                <div class="contact__detail-item">
                  <div class="contact__icon-wrap">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                  </div>
                  <div>
                    <div class="contact__detail-title">Store Location</div>
                    <div class="contact__detail-text">123 Sneaker Street<br>Algiers, Algeria 16000</div>
                  </div>
                </div>
              </div>
              
              <div class="contact__social-title">Follow Us</div>
              <div class="contact__socials">
                <a href="#" class="btn btn--icon btn--secondary">
                  <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a href="#" class="btn btn--icon btn--secondary">
                  <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <form class="contact__form-wrap" id="contact-form">
              <h2 class="contact__title">Send a Message</h2>
              <p class="contact__desc">We'll get back to you within 24 hours.</p>
              
              <div class="grid grid--2">
                <div class="form-group">
                  <label class="form-label">First Name</label>
                  <input type="text" class="form-input" required>
                </div>
                <div class="form-group">
                  <label class="form-label">Last Name</label>
                  <input type="text" class="form-input" required>
                </div>
              </div>
              
              <div class="form-group">
                <label class="form-label">Email Address</label>
                <input type="email" class="form-input" required>
              </div>
              
              <div class="form-group">
                <label class="form-label">Subject</label>
                <select class="form-input">
                  <option>Order Status</option>
                  <option>Returns & Exchanges</option>
                  <option>Product Inquiry</option>
                  <option>Other</option>
                </select>
              </div>
              
              <div class="form-group">
                <label class="form-label">Message</label>
                <textarea class="form-input" required placeholder="How can we help you?"></textarea>
              </div>
              
              <button type="submit" class="btn btn--primary btn--full">Send Message</button>
            </form>
          </div>
        </div>
        
        <div class="contact__map">
          <!-- Fake map embed for demo -->
          <iframe class="contact__map-iframe" src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d102319.46320984166!2d3.0186596954316973!3d36.738600025983754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x128fad3c9834220b%3A0x6ec0c0587d58309!2sAlgiers%2C%20Algeria!5e0!3m2!1sen!2sus!4v1714571212850!5m2!1sen!2sus" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
        </div>
      </div>
    `;
  }

  async afterRender() {
    document.getElementById('contact-form')?.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = e.target.querySelector('button[type="submit"]');
      btn.classList.add('btn--loading');
      
      setTimeout(() => {
        btn.classList.remove('btn--loading');
        e.target.reset();
        import('../components/Toast.js').then(({ Toast }) => {
          Toast.show('Message sent successfully! We will get back to you soon.', 'success');
        });
      }, 1000);
    });
  }
}
