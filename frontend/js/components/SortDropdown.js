// @ts-nocheck

const SORT_OPTIONS = [
  { value: 'featured', label: 'Featured' },
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'top-rated', label: 'Top Rated' },
];

/**
 * Renders the sort dropdown select element.
 * @param {string} [currentSort='featured'] - Currently selected sort value
 * @returns {string} Sort dropdown HTML string
 */
export function renderSortDropdown(currentSort = 'featured') {
  const options = SORT_OPTIONS.map(opt =>
    `<option value="${opt.value}"${opt.value === currentSort ? ' selected' : ''}>${opt.label}</option>`
  ).join('');

  return `
<div class="sort-dropdown" id="sort-dropdown">
  <label class="sort-dropdown__label" for="sort-select">Sort by:</label>
  <select class="sort-dropdown__select form-input" id="sort-select" aria-label="Sort products">
    ${options}
  </select>
</div>`;
}

/**
 * Initializes the sort dropdown to dispatch 'sort-changed' custom events on selection change.
 */
export function initSortDropdown() {
  const select = document.getElementById('sort-select');
  if (!select) return;

  select.addEventListener('change', () => {
    document.dispatchEvent(new CustomEvent('sort-changed', {
      detail: { sort: select.value },
    }));
  });
}
