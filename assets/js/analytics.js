/* ==========================================================================
   Analytics — Privacy-first analytics with cookie consent
   ========================================================================== */

'use strict';

const Analytics = (() => {
  'use strict';

  let enabled = false;

  // --- Check consent ---
  const checkConsent = () => {
    const consent = localStorage.getItem('cookie-consent');
    enabled = consent === 'accepted';
    return enabled;
  };

  // --- Track page view ---
  const trackPageView = () => {
    if (!enabled) return;

    // Google Analytics 4 (gtag) - only fires if GA is configured
    if (typeof gtag === 'function') {
      gtag('config', window.GA_MEASUREMENT_ID || 'G-XXXXXXXXXX', {
        page_path: window.location.pathname,
        page_title: document.title,
      });
    }
  };

  // --- Track event ---
  const trackEvent = (action, category, label, value) => {
    if (!enabled) return;

    if (typeof gtag === 'function') {
      gtag('event', action, {
        event_category: category,
        event_label: label,
        value: value,
      });
    }
  };

  // --- Track form submission ---
  const trackFormSubmit = (formName) => {
    trackEvent('form_submit', 'Form', formName);
  };

  // --- Track outbound link ---
  const trackOutboundLink = (url) => {
    trackEvent('click', 'Outbound Link', url);
  };

  // --- Enable analytics ---
  const enable = () => {
    enabled = true;
    trackPageView();
  };

  // --- Disable analytics ---
  const disable = () => {
    enabled = false;
  };

  // --- Init GA script if consent given ---
  const init = () => {
    checkConsent();

    // Track outbound links
    document.addEventListener('click', (e) => {
      const link = e.target.closest('a');
      if (!link) return;

      const href = link.getAttribute('href');
      if (href && href.startsWith('http') && !href.includes(window.location.hostname)) {
        trackOutboundLink(href);
      }
    });

    // Track form submissions
    document.addEventListener('submit', (e) => {
      const form = e.target;
      if (form.hasAttribute('data-form')) {
        const formName = form.getAttribute('data-form-name') || form.id || 'unknown';
        trackFormSubmit(formName);
      }
    });
  };

  return { init, enable, disable, trackPageView, trackEvent };
})();
