/* ==========================================================================
   App — Main Application Entry Point
   ==========================================================================
   
   Initializes all modules and provides shared utilities.
   ========================================================================== */

'use strict';

const App = (() => {
  'use strict';

  // --- DOM Ready ---
  const domReady = (callback) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', callback);
    } else {
      callback();
    }
  };

  // --- Debounce utility ---
  const debounce = (fn, delay = 300) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn.apply(null, args), delay);
    };
  };

  // --- Throttle utility ---
  const throttle = (fn, limit = 100) => {
    let inThrottle;
    return (...args) => {
      if (!inThrottle) {
        fn.apply(null, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // --- Format number with commas ---
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // --- Slugify a string ---
  const slugify = (text) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_]+/g, '-')
      .replace(/-+/g, '-');
  };

  // --- Get URL parameter ---
  const getParam = (name, url = window.location.href) => {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  };

  // --- Scroll to element with offset ---
  const scrollToElement = (element, offset = 0) => {
    if (!element) return;
    const headerOffset = parseInt(getComputedStyle(document.documentElement)
      .getPropertyValue('--header-height')) + offset;
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  };

  // --- Detect touch device ---
  const isTouchDevice = () => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  };

  // --- Check if element is in viewport ---
  const isInViewport = (element, offset = 0) => {
    if (!element) return false;
    const rect = element.getBoundingClientRect();
    return (
      rect.top <= (window.innerHeight - offset) &&
      rect.bottom >= offset
    );
  };

  // --- Initialize all modules ---
  const init = () => {
    domReady(() => {
      // Initialize all modules in order
      if (typeof Navigation !== 'undefined') Navigation.init();
      if (typeof Search !== 'undefined') Search.init();
      if (typeof Accordion !== 'undefined') Accordion.init();
      if (typeof FAQ !== 'undefined') FAQ.init();
      if (typeof Forms !== 'undefined') Forms.init();
      if (typeof LazyLoad !== 'undefined') LazyLoad.init();
      if (typeof Analytics !== 'undefined') Analytics.init();
      
      // Global UI initializations
      initBackToTop();
      initScrollAnimations();
      initCookieConsent();
      initMobileDropdowns();
    });
  };

  // --- Back to Top Button ---
  const initBackToTop = () => {
    const btn = document.querySelector('[data-back-to-top]');
    if (!btn) return;

    const toggleVisibility = throttle(() => {
      if (window.scrollY > 400) {
        btn.classList.add('back-to-top--visible');
      } else {
        btn.classList.remove('back-to-top--visible');
      }
    }, 100);

    window.addEventListener('scroll', toggleVisibility, { passive: true });

    btn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  // --- Scroll-triggered Animations ---
  const initScrollAnimations = () => {
    const elements = document.querySelectorAll('.animate');
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate--visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    });

    elements.forEach((el) => observer.observe(el));
  };

  // --- Cookie Consent ---
  const initCookieConsent = () => {
    const cookieBar = document.querySelector('[data-cookie-bar]');
    if (!cookieBar) return;

    if (localStorage.getItem('cookie-consent')) {
      return;
    }

    setTimeout(() => {
      cookieBar.classList.add('cookie-bar--visible');
    }, 1000);

    const acceptBtn = cookieBar.querySelector('[data-cookie-accept]');
    const declineBtn = cookieBar.querySelector('[data-cookie-decline]');

    if (acceptBtn) {
      acceptBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'accepted');
        cookieBar.classList.remove('cookie-bar--visible');
        if (typeof Analytics !== 'undefined') {
          Analytics.enable();
        }
      });
    }

    if (declineBtn) {
      declineBtn.addEventListener('click', () => {
        localStorage.setItem('cookie-consent', 'declined');
        cookieBar.classList.remove('cookie-bar--visible');
      });
    }
  };

  // --- Mobile dropdown toggles (for nav with children) ---
  const initMobileDropdowns = () => {
    if (!isTouchDevice() && window.innerWidth > 768) return;

    const navItems = document.querySelectorAll('.nav__item--has-mega');
    
    navItems.forEach((item) => {
      const link = item.querySelector('.nav__link');
      if (!link) return;

      link.addEventListener('click', (e) => {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          const mega = item.querySelector('.mega-menu');
          if (mega) {
            mega.classList.toggle('mega-menu--open');
          }
        }
      });
    });
  };

  // --- Public API ---
  return {
    init,
    debounce,
    throttle,
    formatNumber,
    slugify,
    getParam,
    scrollToElement,
    isInViewport,
    isTouchDevice,
  };
})();

// Initialize on load
App.init();
