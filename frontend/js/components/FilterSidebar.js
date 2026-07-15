// @ts-nocheck
import { formatPrice } from '../utils/helpers.js';

const ICONS = {
  chevron: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>`,
  close: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
  filter: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>`,
};

const BRANDS = ['Nike', 'Adidas', 'Puma', 'New Balance', 'Reebok', 'Converse'];
const CATEGORIES = ['Running', 'Lifestyle', 'Basketball', 'Skateboarding', 'Training'];
const SIZES = [38, 39, 40, 41, 42, 43, 44, 45];
const COLORS = [
  { name: 'Black', value: '#000000' },
  { name: 'White', value: '#FFFFFF' },
  { name: 'Red', value: '#EF4444' },
  { name: 'Blue', value: '#3B82F6' },
  { name: 'Green', value: '#22C55E' },
  { name: 'Yellow', value: '#EAB308' },
  { name: 'Orange', value: '#F97316' },
  { name: 'Pink', value: '#EC4899' },
  { name: 'Grey', value: '#6B7280' },
  { name: 'Brown', value: '#92400E' },
];

/**
 * Counts active filters for a specific section to display on the section header.
 * @param {string} section
 * @param {Object} activeFilters
 * @returns {number}
 */
function getActiveCount(section, activeFilters) {
  switch (section) {
    case 'brands': return activeFilters.brands.length;
    case 'categories': return activeFilters.categories.length;
    case 'sizes': return activeFilters.sizes.length;
    case 'colors': return activeFilters.colors.length;
    case 'priceRange': {
      const [min, max] = activeFilters.priceRange;
      return (min > 0 || max < 50000) ? 1 : 0;
    }
    default: return 0;
  }
}

/**
 * Renders a collapsible section header.
 * @param {string} title
 * @param {string} sectionId
 * @param {number} activeCount
 * @returns {string}
 */
function renderSectionHeader(title, sectionId, activeCount) {
  return `
    <button class="filter-sidebar__section-header" data-section="${sectionId}" aria-expanded="true" aria-label="Toggle ${title} filter">
      <span class="filter-sidebar__section-title">
        ${title}
        ${activeCount > 0 ? `<span class="filter-sidebar__active-count">${activeCount}</span>` : ''}
      </span>
      <span class="filter-sidebar__chevron">${ICONS.chevron}</span>
    </button>`;
}

/**
 * Renders the complete filter sidebar.
 * @param {Object} filters - Available filter values
 * @param {Object} activeFilters - Currently selected filter values
 * @returns {string} Filter sidebar HTML
 */
export function renderFilterSidebar(filters = {}, activeFilters = { brands: [], categories: [], sizes: [], priceRange: [0, 50000], colors: [] }) {
  const brandsContent = BRANDS.map(brand => `
    <label class="filter-sidebar__checkbox">
      <input type="checkbox" name="brand" value="${brand}" ${activeFilters.brands.includes(brand) ? 'checked' : ''}>
      <span class="filter-sidebar__checkbox-mark"></span>
      <span class="filter-sidebar__checkbox-label">${brand}</span>
    </label>
  `).join('');

  const categoriesContent = CATEGORIES.map(cat => `
    <label class="filter-sidebar__checkbox">
      <input type="checkbox" name="category" value="${cat}" ${activeFilters.categories.includes(cat) ? 'checked' : ''}>
      <span class="filter-sidebar__checkbox-mark"></span>
      <span class="filter-sidebar__checkbox-label">${cat}</span>
    </label>
  `).join('');

  const sizesContent = SIZES.map(size => `
    <button class="filter-sidebar__size-btn${activeFilters.sizes.includes(size) ? ' active' : ''}" data-size="${size}" aria-label="Size ${size}">
      ${size}
    </button>
  `).join('');

  const colorsContent = COLORS.map(color => `
    <button
      class="filter-sidebar__color-swatch${activeFilters.colors.includes(color.name) ? ' active' : ''}"
      data-color="${color.name}"
      style="background-color: ${color.value}${color.name === 'White' ? '; border: 1px solid var(--color-border)' : ''}"
      aria-label="${color.name}"
      title="${color.name}"
    ></button>
  `).join('');

  const totalActive = activeFilters.brands.length
    + activeFilters.categories.length
    + activeFilters.sizes.length
    + activeFilters.colors.length
    + (activeFilters.priceRange[0] > 0 || activeFilters.priceRange[1] < 50000 ? 1 : 0);

  return `
<aside class="filter-sidebar" id="filter-sidebar">
  <div class="filter-sidebar__header">
    <h3 class="filter-sidebar__title">
      ${ICONS.filter}
      Filters
      ${totalActive > 0 ? `<span class="filter-sidebar__total-count">${totalActive}</span>` : ''}
    </h3>
    <button class="filter-sidebar__close" id="filter-sidebar-close" aria-label="Close filters">
      ${ICONS.close}
    </button>
  </div>

  ${totalActive > 0 ? `
  <button class="filter-sidebar__clear-all" id="filter-clear-all" aria-label="Clear all filters">
    Clear All Filters
  </button>` : ''}

  <div class="filter-sidebar__sections">
    <!-- Brands -->
    <div class="filter-sidebar__section" data-filter-section="brands">
      ${renderSectionHeader('Brands', 'brands', getActiveCount('brands', activeFilters))}
      <div class="filter-sidebar__section-body" id="filter-brands">
        ${brandsContent}
      </div>
    </div>

    <!-- Categories -->
    <div class="filter-sidebar__section" data-filter-section="categories">
      ${renderSectionHeader('Categories', 'categories', getActiveCount('categories', activeFilters))}
      <div class="filter-sidebar__section-body" id="filter-categories">
        ${categoriesContent}
      </div>
    </div>

    <!-- Sizes -->
    <div class="filter-sidebar__section" data-filter-section="sizes">
      ${renderSectionHeader('Sizes', 'sizes', getActiveCount('sizes', activeFilters))}
      <div class="filter-sidebar__section-body" id="filter-sizes">
        <div class="filter-sidebar__size-grid">
          ${sizesContent}
        </div>
      </div>
    </div>

    <!-- Price Range -->
    <div class="filter-sidebar__section" data-filter-section="priceRange">
      ${renderSectionHeader('Price Range', 'priceRange', getActiveCount('priceRange', activeFilters))}
      <div class="filter-sidebar__section-body" id="filter-price-range">
        <div class="filter-sidebar__price-inputs">
          <div class="filter-sidebar__price-field">
            <label for="price-min">Min</label>
            <input type="number" class="form-input" id="price-min" min="0" max="50000" step="100" value="${activeFilters.priceRange[0]}" placeholder="0" aria-label="Minimum price in cents">
          </div>
          <span class="filter-sidebar__price-separator">—</span>
          <div class="filter-sidebar__price-field">
            <label for="price-max">Max</label>
            <input type="number" class="form-input" id="price-max" min="0" max="50000" step="100" value="${activeFilters.priceRange[1]}" placeholder="50000" aria-label="Maximum price in cents">
          </div>
        </div>
        <div class="filter-sidebar__price-display">
          <span>${formatPrice(activeFilters.priceRange[0])}</span>
          <span>${formatPrice(activeFilters.priceRange[1])}</span>
        </div>
      </div>
    </div>

    <!-- Colors -->
    <div class="filter-sidebar__section" data-filter-section="colors">
      ${renderSectionHeader('Colors', 'colors', getActiveCount('colors', activeFilters))}
      <div class="filter-sidebar__section-body" id="filter-colors">
        <div class="filter-sidebar__color-grid">
          ${colorsContent}
        </div>
      </div>
    </div>
  </div>

  <div class="filter-sidebar__apply-mobile">
    <button class="btn btn--primary btn--full" id="filter-apply-mobile" aria-label="Apply filters">Apply Filters</button>
  </div>
</aside>`;
}

/**
 * Gathers all current filter selections from the DOM and returns the active filter state.
 * @returns {Object} activeFilters
 */
function gatherFilters() {
  const brands = [];
  document.querySelectorAll('#filter-brands input[name="brand"]:checked').forEach(cb => {
    brands.push(cb.value);
  });

  const categories = [];
  document.querySelectorAll('#filter-categories input[name="category"]:checked').forEach(cb => {
    categories.push(cb.value);
  });

  const sizes = [];
  document.querySelectorAll('.filter-sidebar__size-btn.active').forEach(btn => {
    sizes.push(parseInt(btn.getAttribute('data-size'), 10));
  });

  const colors = [];
  document.querySelectorAll('.filter-sidebar__color-swatch.active').forEach(btn => {
    colors.push(btn.getAttribute('data-color'));
  });

  const minInput = document.getElementById('price-min');
  const maxInput = document.getElementById('price-max');
  const priceRange = [
    minInput ? parseInt(minInput.value, 10) || 0 : 0,
    maxInput ? parseInt(maxInput.value, 10) || 50000 : 50000,
  ];

  return { brands, categories, sizes, priceRange, colors };
}

/**
 * Dispatches the 'filters-changed' custom event with current filter state.
 */
function dispatchFiltersChanged() {
  const activeFilters = gatherFilters();
  document.dispatchEvent(new CustomEvent('filters-changed', {
    detail: { filters: activeFilters },
  }));
}

/**
 * Initializes all filter sidebar interactions.
 */
export function initFilterSidebar() {
  const sidebar = document.getElementById('filter-sidebar');
  if (!sidebar) return;

  // Section collapse/expand
  sidebar.addEventListener('click', (e) => {
    const sectionHeader = e.target.closest('.filter-sidebar__section-header');
    if (sectionHeader) {
      const sectionId = sectionHeader.getAttribute('data-section');
      const section = sectionHeader.closest('.filter-sidebar__section');
      const body = section ? section.querySelector('.filter-sidebar__section-body') : null;

      if (body) {
        const isExpanded = sectionHeader.getAttribute('aria-expanded') === 'true';
        sectionHeader.setAttribute('aria-expanded', String(!isExpanded));
        body.style.display = isExpanded ? 'none' : 'block';
        sectionHeader.querySelector('.filter-sidebar__chevron').style.transform = isExpanded ? 'rotate(-90deg)' : 'rotate(0deg)';
      }
      return;
    }

    // Size button toggle
    const sizeBtn = e.target.closest('.filter-sidebar__size-btn');
    if (sizeBtn) {
      sizeBtn.classList.toggle('active');
      dispatchFiltersChanged();
      return;
    }

    // Color swatch toggle
    const colorSwatch = e.target.closest('.filter-sidebar__color-swatch');
    if (colorSwatch) {
      colorSwatch.classList.toggle('active');
      dispatchFiltersChanged();
      return;
    }
  });

  // Checkbox changes (brands, categories)
  sidebar.addEventListener('change', (e) => {
    if (e.target.matches('input[type="checkbox"]')) {
      dispatchFiltersChanged();
    }
  });

  // Price range input changes (debounced)
  let priceDebounce = null;
  const priceMin = document.getElementById('price-min');
  const priceMax = document.getElementById('price-max');

  function handlePriceChange() {
    if (priceDebounce) clearTimeout(priceDebounce);
    priceDebounce = setTimeout(() => {
      dispatchFiltersChanged();
    }, 500);
  }

  if (priceMin) priceMin.addEventListener('input', handlePriceChange);
  if (priceMax) priceMax.addEventListener('input', handlePriceChange);

  // Clear all filters
  const clearAllBtn = document.getElementById('filter-clear-all');
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', () => {
      // Uncheck all checkboxes
      sidebar.querySelectorAll('input[type="checkbox"]:checked').forEach(cb => {
        cb.checked = false;
      });

      // Deactivate all size buttons
      sidebar.querySelectorAll('.filter-sidebar__size-btn.active').forEach(btn => {
        btn.classList.remove('active');
      });

      // Deactivate all color swatches
      sidebar.querySelectorAll('.filter-sidebar__color-swatch.active').forEach(btn => {
        btn.classList.remove('active');
      });

      // Reset price inputs
      if (priceMin) priceMin.value = '0';
      if (priceMax) priceMax.value = '50000';

      dispatchFiltersChanged();
    });
  }

  // Close button (mobile)
  const closeBtn = document.getElementById('filter-sidebar-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      sidebar.classList.remove('active');
    });
  }

  // Apply button (mobile)
  const applyBtn = document.getElementById('filter-apply-mobile');
  if (applyBtn) {
    applyBtn.addEventListener('click', () => {
      dispatchFiltersChanged();
      sidebar.classList.remove('active');
    });
  }
}
