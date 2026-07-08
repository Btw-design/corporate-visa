/* ==========================================================================
   FAQ — Accordion-based FAQ with schema generation
   ========================================================================== */

'use strict';

const FAQ = (() => {
  'use strict';

  // --- Generate FAQ Schema (JSON-LD) ---
  const generateSchema = (container) => {
    const items = container.querySelectorAll('.faq__item');
    if (!items.length) return;

    const faqSchema = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [],
    };

    items.forEach((item) => {
      const questionEl = item.querySelector('.accordion__trigger');
      const answerEl = item.querySelector('.accordion__body');

      if (questionEl && answerEl) {
        // Get text content excluding SVG icon
        const questionText = questionEl.childNodes[0]?.textContent?.trim() || questionEl.textContent.trim();
        faqSchema.mainEntity.push({
          '@type': 'Question',
          name: questionText,
          acceptedAnswer: {
            '@type': 'Answer',
            text: answerEl.textContent.trim(),
          },
        });
      }
    });

    if (faqSchema.mainEntity.length) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(faqSchema, null, 2);
      document.head.appendChild(script);
    }
  };

  // --- Public ---

  const init = () => {
    // Initialize accordion behavior for FAQ items
    Accordion.init();

    // Generate schema for all FAQ sections
    document.querySelectorAll('.faq').forEach((container) => {
      generateSchema(container);
    });
  };

  return { init };
})();
