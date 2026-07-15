export class Toast {
  static container = document.getElementById('toast-container');

  /**
   * Shows a toast notification
   * @param {String} message 
   * @param {String} type - 'success', 'error', 'info'
   * @param {Number} duration - ms
   */
  static show(message, type = 'info', duration = 3000) {
    if (!this.container) {
      this.container = document.getElementById('toast-container');
    }

    const toast = document.createElement('div');
    toast.className = `toast toast--${type}`;
    toast.setAttribute('role', 'alert');

    let icon = '';
    if (type === 'success') {
      icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>';
    } else if (type === 'error') {
      icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>';
    } else {
      icon = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>';
    }

    toast.innerHTML = `
      <div class="toast__icon">${icon}</div>
      <div class="toast__content">
        <p class="toast__message">${message}</p>
      </div>
      <button class="toast__close" aria-label="Close">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
      </button>
    `;

    this.container.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('toast--visible');
    });

    const remove = () => {
      toast.classList.remove('toast--visible');
      toast.classList.add('toast--removing');
      setTimeout(() => {
        toast.remove();
      }, 300); // match CSS transition duration
    };

    toast.querySelector('.toast__close').addEventListener('click', remove);

    if (duration > 0) {
      setTimeout(remove, duration);
    }
  }
}
