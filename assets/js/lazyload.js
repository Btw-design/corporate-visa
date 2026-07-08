/* ==========================================================================
   LazyLoad — Native lazy loading with Intersection Observer fallback
   ========================================================================== */

'use strict';

const LazyLoad = (() => {
  'use strict';

  // --- Check for native lazy loading support ---
  const supportsNativeLazy = 'loading' in HTMLImageElement.prototype;

  // --- Lazy load images ---
  const lazyLoadImages = () => {
    const images = document.querySelectorAll('[data-src]');

    if (supportsNativeLazy) {
      // Use native lazy loading
      images.forEach((img) => {
        img.loading = 'lazy';
        img.src = img.dataset.src;
        if (img.dataset.srcset) {
          img.srcset = img.dataset.srcset;
        }
        img.removeAttribute('data-src');
        img.removeAttribute('data-srcset');
      });
      return;
    }

    // Fallback: Intersection Observer
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
          }
          img.classList.add('lazy-loaded');
          img.removeAttribute('data-src');
          img.removeAttribute('data-srcset');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '200px 0px',
      threshold: 0.01,
    });

    images.forEach((img) => imageObserver.observe(img));
  };

  // --- Lazy load background images ---
  const lazyLoadBackgrounds = () => {
    const elements = document.querySelectorAll('[data-bg-src]');

    if ('IntersectionObserver' in window) {
      const bgObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            el.style.backgroundImage = `url('${el.dataset.bgSrc}')`;
            el.classList.add('lazy-bg-loaded');
            el.removeAttribute('data-bg-src');
            bgObserver.unobserve(el);
          }
        });
      }, {
        rootMargin: '200px 0px',
      });

      elements.forEach((el) => bgObserver.observe(el));
    } else {
      elements.forEach((el) => {
        el.style.backgroundImage = `url('${el.dataset.bgSrc}')`;
      });
    }
  };

  // --- Lazy load iframes ---
  const lazyLoadIframes = () => {
    const iframes = document.querySelectorAll('iframe[data-src]');

    if ('IntersectionObserver' in window) {
      const iframeObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const iframe = entry.target;
            iframe.src = iframe.dataset.src;
            iframe.removeAttribute('data-src');
            iframeObserver.unobserve(iframe);
          }
        });
      }, {
        rootMargin: '200px 0px',
      });

      iframes.forEach((iframe) => iframeObserver.observe(iframe));
    } else {
      iframes.forEach((iframe) => {
        iframe.src = iframe.dataset.src;
      });
    }
  };

  // --- Public ---

  const init = () => {
    lazyLoadImages();
    lazyLoadBackgrounds();
    lazyLoadIframes();

    // Re-run when dynamic content is loaded
    document.addEventListener('contentLoaded', () => {
      lazyLoadImages();
      lazyLoadBackgrounds();
    });
  };

  return { init };
})();
