// @ts-nocheck

const ICONS = {
  search: `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>`,
  close: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
};

/**
 * Renders the shop page search bar with icon, input, and clear button.
 * @param {string} [currentQuery=''] - Pre-filled query string
 * @returns {string} Search bar HTML string
 */
export function renderSearchBar(currentQuery = '') {
  return `
<div class="search-bar" id="shop-search-bar">
  <div class="search-bar__inner">
    <span class="search-bar__icon">${ICONS.search}</span>
    <input
      type="search"
      class="search-bar__input form-input"
      id="shop-search-input"
      placeholder="Search sneakers by name, brand..."
      value="${currentQuery}"
      aria-label="Search products"
    >
    <button
      class="search-bar__clear"
      id="shop-search-clear"
      aria-label="Clear search"
      style="display:${currentQuery ? 'flex' : 'none'}"
    >
      ${ICONS.close}
    </button>
  </div>
</div>`;
}

/**
 * Initializes the shop search bar with debounced input and clear functionality.
 * Dispatches 'search-changed' custom events on the document.
 */
export function initSearchBar() {
  const input = document.getElementById('shop-search-input');
  const clearBtn = document.getElementById('shop-search-clear');
  if (!input) return;

  let debounceTimer = null;

  /**
   * Dispatches a 'search-changed' custom event with the current query.
   * @param {string} query
   */
  function dispatchSearch(query) {
    document.dispatchEvent(new CustomEvent('search-changed', {
      detail: { query },
    }));
  }

  // Debounced input handler
  input.addEventListener('input', () => {
    const value = input.value.trim();

    // Show/hide clear button
    if (clearBtn) {
      clearBtn.style.display = value ? 'flex' : 'none';
    }

    // Debounce the search event dispatch
    if (debounceTimer) clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      dispatchSearch(value);
    }, 300);
  });

  // Clear button handler
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      input.value = '';
      clearBtn.style.display = 'none';
      if (debounceTimer) clearTimeout(debounceTimer);
      dispatchSearch('');
      input.focus();
    });
  }

  // Enter key handler
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      if (debounceTimer) clearTimeout(debounceTimer);
      dispatchSearch(input.value.trim());
    }
  });
}
