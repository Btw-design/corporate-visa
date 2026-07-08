/* ==========================================================================
   Search — Live search with results
   ========================================================================== */

'use strict';

const Search = (() => {
  'use strict';

  let searchData = [];
  let searchInput = null;
  let searchResults = null;

  // --- Load search index from JSON ---
  const loadSearchIndex = async () => {
    try {
      const response = await fetch('/data/search-index.json');
      if (response.ok) {
        searchData = await response.json();
      }
    } catch (err) {
      console.warn('Search index not available, using inline data');
      // Fallback inline data
      searchData = getInlineSearchData();
    }
  };

  // --- Fallback inline data ---
  const getInlineSearchData = () => {
    return [
      { title: 'Home', url: '/', category: 'Page' },
      { title: 'About Us', url: '/about/', category: 'Page' },
      { title: 'Contact Us', url: '/contact-us/', category: 'Page' },
      { title: 'Business Visa Assistance', url: '/business-visa-assistance/', category: 'Service' },
      { title: 'Corporate Air Ticketing', url: '/corporate-air-ticketing/', category: 'Service' },
      { title: 'Corporate Hotel Booking', url: '/corporate-hotel-booking/', category: 'Service' },
      { title: 'Corporate Holiday Packages', url: '/corporate-holiday-packages/', category: 'Service' },
      { title: 'Ok to Board', url: '/ok-to-board/', category: 'Service' },
      { title: 'Passport Index', url: '/passport-index/', category: 'Service' },
      { title: 'Visa Tracking', url: '/visa-tracking/', category: 'Service' },
      { title: 'Insights', url: '/insights/', category: 'Blog' },
      { title: 'Awareness', url: '/awareness/', category: 'Blog' },
      { title: 'Visa News & Updates', url: '/visa-news-updates/', category: 'News' },
      { title: 'e-Visa', url: '/evisa/', category: 'Service' },
      { title: 'Visa Guide', url: '/visa-guide/', category: 'Guide' },
    ];
  };

  // --- Perform search ---
  const performSearch = (query) => {
    if (!query || query.length < 2) {
      searchResults.classList.remove('search__results--active');
      return;
    }

    const q = query.toLowerCase();
    const results = searchData.filter((item) => {
      return item.title.toLowerCase().includes(q) ||
             item.category.toLowerCase().includes(q);
    });

    renderResults(results, q);
  };

  // --- Render search results ---
  const renderResults = (results, query) => {
    if (!searchResults) return;

    if (results.length === 0) {
      searchResults.innerHTML = `
        <div class="search__no-results">
          No results found for "${query}"
        </div>
      `;
    } else {
      searchResults.innerHTML = results.slice(0, 8).map((item) => `
        <a href="${item.url}" class="search__result-item">
          <span class="search__result-icon">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>
            </svg>
          </span>
          <span>
            <span class="search__result-title">${highlightMatch(item.title, query)}</span>
            <span class="search__result-desc">${item.category}</span>
          </span>
        </a>
      `).join('');
    }

    searchResults.classList.add('search__results--active');
  };

  // --- Highlight matching text ---
  const highlightMatch = (text, query) => {
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark style="background:var(--color-primary-light);color:var(--color-primary);padding:0 2px;border-radius:2px;">$1</mark>');
  };

  // --- Close search results ---
  const closeResults = () => {
    if (searchResults) {
      searchResults.classList.remove('search__results--active');
    }
  };

  // --- Handle input with debounce ---
  const handleInput = App.debounce((e) => {
    performSearch(e.target.value);
  }, 300);

  // --- Public ---

  const init = () => {
    searchInput = document.querySelector('[data-search-input]');
    searchResults = document.querySelector('[data-search-results]');

    if (!searchInput || !searchResults) return;

    loadSearchIndex();

    searchInput.addEventListener('input', handleInput);

    searchInput.addEventListener('focus', () => {
      if (searchInput.value.length >= 2) {
        performSearch(searchInput.value);
      }
    });

    // Close on Escape
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeResults();
        searchInput.blur();
      }
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.search')) {
        closeResults();
      }
    });
  };

  return { init };
})();
