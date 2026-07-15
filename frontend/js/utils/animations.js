// ============================================================================
// Animation Utilities
// ============================================================================
// Provides reusable animation primitives for the SNKRS DZ SPA.
// Uses CSS transitions where possible for GPU acceleration; falls back to
// requestAnimationFrame for computed animations (counter).
// ============================================================================

/**
 * Initialize scroll-reveal: elements with the '.reveal' class get the
 * '.revealed' class added when they scroll into view (threshold 10%).
 * Uses IntersectionObserver for performance — no scroll-event polling.
 *
 * Call this once on app init, and again after dynamic content injection
 * (the observer handles new .reveal elements automatically).
 */
export function initScrollReveal() {
  if (typeof IntersectionObserver === 'undefined') {
    // Fallback: immediately reveal everything
    document.querySelectorAll('.reveal').forEach((el) => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target); // One-shot reveal
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Fade an element in from opacity 0 → 1.
 * Resolves when the transition ends.
 *
 * @param {HTMLElement} element
 * @param {number} [duration=300] — Milliseconds.
 * @returns {Promise<void>}
 */
export function fadeIn(element, duration = 300) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return; }

    element.style.opacity = '0';
    element.style.display = '';
    element.style.transition = `opacity ${duration}ms ease`;

    // Force reflow so the browser registers opacity:0 before transitioning
    void element.offsetHeight;

    element.style.opacity = '1';

    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.style.transition = '';
      resolve();
    };
    element.addEventListener('transitionend', onEnd);

    // Safety timeout in case transitionend doesn't fire
    setTimeout(onEnd, duration + 50);
  });
}

/**
 * Fade an element out from opacity 1 → 0.
 * Resolves when the transition ends.
 *
 * @param {HTMLElement} element
 * @param {number} [duration=300] — Milliseconds.
 * @returns {Promise<void>}
 */
export function fadeOut(element, duration = 300) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return; }

    element.style.opacity = '1';
    element.style.transition = `opacity ${duration}ms ease`;

    // Force reflow
    void element.offsetHeight;

    element.style.opacity = '0';

    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.style.transition = '';
      resolve();
    };
    element.addEventListener('transitionend', onEnd);

    // Safety timeout
    setTimeout(onEnd, duration + 50);
  });
}

/**
 * Slide an element in from a given direction.
 *
 * @param {HTMLElement} element
 * @param {'left'|'right'|'up'|'down'} [direction='up']
 * @param {number} [duration=400] — Milliseconds.
 * @returns {Promise<void>}
 */
export function slideIn(element, direction = 'up', duration = 400) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return; }

    const offsets = {
      left:  { x: '-40px', y: '0' },
      right: { x: '40px',  y: '0' },
      up:    { x: '0',     y: '30px' },
      down:  { x: '0',     y: '-30px' },
    };

    const { x, y } = offsets[direction] || offsets.up;

    element.style.opacity = '0';
    element.style.transform = `translate(${x}, ${y})`;
    element.style.transition = `opacity ${duration}ms ease, transform ${duration}ms ease`;

    // Force reflow
    void element.offsetHeight;

    element.style.opacity = '1';
    element.style.transform = 'translate(0, 0)';

    const onEnd = () => {
      element.removeEventListener('transitionend', onEnd);
      element.style.transition = '';
      element.style.transform = '';
      resolve();
    };
    element.addEventListener('transitionend', onEnd);

    // Safety timeout (we may get two transitionend events — opacity + transform)
    setTimeout(onEnd, duration + 50);
  });
}

/**
 * Animate a numeric counter from 0 to `target` using easeOutQuad.
 *
 * @param {HTMLElement} element — Text content is updated with the current value.
 * @param {number} target — Target number (integer).
 * @param {number} [duration=1000] — Milliseconds.
 * @returns {Promise<void>}
 */
export function animateCounter(element, target, duration = 1000) {
  return new Promise((resolve) => {
    if (!element) { resolve(); return; }

    const start = performance.now();
    const from = 0;

    function easeOutQuad(t) {
      return t * (2 - t);
    }

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuad(progress);
      const current = Math.round(from + (target - from) * eased);

      element.textContent = current.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        element.textContent = target.toLocaleString();
        resolve();
      }
    }

    requestAnimationFrame(tick);
  });
}

/**
 * Page-level transition: fade out the current content, call the render
 * function to update the DOM, then fade the new content back in.
 *
 * @param {HTMLElement} appElement — The container element to transition.
 * @param {Function} renderFn — Called between fade-out and fade-in to swap content.
 * @param {number} [duration=200] — Duration for each fade phase.
 * @returns {Promise<void>}
 */
export async function pageTransition(appElement, renderFn, duration = 200) {
  if (!appElement || typeof renderFn !== 'function') {
    if (typeof renderFn === 'function') renderFn();
    return;
  }

  await fadeOut(appElement, duration);
  renderFn();
  await fadeIn(appElement, duration);

  // Re-initialize scroll reveal for newly rendered content
  initScrollReveal();
}

/**
 * Stagger the appearance of child elements with incremental delays.
 * Each child matching `selector` gets a delay proportional to its index.
 *
 * @param {HTMLElement} parent
 * @param {string} [selector='.stagger-item'] — CSS selector for children.
 * @param {number} [delay=80] — Base delay increment in milliseconds.
 */
export function staggerChildren(parent, selector = '.stagger-item', delay = 80) {
  if (!parent) return;

  const children = parent.querySelectorAll(selector);
  children.forEach((child, index) => {
    child.style.opacity = '0';
    child.style.transform = 'translateY(20px)';
    child.style.transition = `opacity 400ms ease, transform 400ms ease`;
    child.style.transitionDelay = `${index * delay}ms`;

    // Force reflow to apply initial state
    void child.offsetHeight;

    // Trigger the animation
    requestAnimationFrame(() => {
      child.style.opacity = '1';
      child.style.transform = 'translateY(0)';
    });
  });
}
