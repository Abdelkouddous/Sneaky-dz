// @ts-nocheck

/**
 * Renders the product gallery with a main image and a thumbnail strip.
 * @param {string[]} images - Array of image URLs
 * @returns {string} Gallery HTML string
 */
export function renderProductGallery(images) {
  if (!images || images.length === 0) {
    return `<div class="product-gallery"><p>No images available</p></div>`;
  }

  const thumbnails = images.map((img, index) => `
    <button
      class="product-gallery__thumb${index === 0 ? ' active' : ''}"
      data-gallery-index="${index}"
      aria-label="View image ${index + 1}"
    >
      <img src="${img}" alt="Product thumbnail ${index + 1}" loading="lazy">
    </button>
  `).join('');

  return `
<div class="product-gallery" id="product-gallery">
  <div class="product-gallery__thumbs">
    ${thumbnails}
  </div>
  <div class="product-gallery__main">
    <div class="product-gallery__main-wrapper" id="gallery-main-wrapper">
      <img
        class="product-gallery__main-image"
        id="gallery-main-image"
        src="${images[0]}"
        alt="Product main image"
      >
    </div>
  </div>
</div>`;
}

/**
 * Initializes gallery interactions: thumbnail switching with fade,
 * and mouse-based zoom on the main image.
 */
export function initProductGallery() {
  const gallery = document.getElementById('product-gallery');
  if (!gallery) return;

  const mainImage = document.getElementById('gallery-main-image');
  const mainWrapper = document.getElementById('gallery-main-wrapper');
  const thumbButtons = gallery.querySelectorAll('.product-gallery__thumb');

  if (!mainImage || thumbButtons.length === 0) return;

  // Thumbnail click → change main image with fade
  thumbButtons.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const index = parseInt(thumb.getAttribute('data-gallery-index'), 10);
      const img = thumb.querySelector('img');
      if (!img) return;

      const newSrc = img.getAttribute('src');

      // Remove active from all thumbs
      thumbButtons.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');

      // Fade out → change src → fade in
      mainImage.style.opacity = '0';
      mainImage.style.transition = 'opacity 0.3s ease';

      setTimeout(() => {
        mainImage.src = newSrc;
        mainImage.style.opacity = '1';
      }, 300);
    });
  });

  // Mouse-move zoom on main image
  if (mainWrapper) {
    mainWrapper.addEventListener('mousemove', (e) => {
      const rect = mainWrapper.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;

      mainImage.style.transformOrigin = `${x}% ${y}%`;
      mainImage.style.transform = 'scale(1.8)';
    });

    mainWrapper.addEventListener('mouseleave', () => {
      mainImage.style.transform = 'scale(1)';
      mainImage.style.transformOrigin = 'center center';
    });
  }
}
