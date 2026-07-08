/* ==========================================================================
   Accordion — Reusable accordion component
   ========================================================================== */

'use strict';

const Accordion = (() => {
  'use strict';

  const init = (container = document) => {
    const triggers = container.querySelectorAll('.accordion__trigger');

    triggers.forEach((trigger) => {
      // Remove existing listeners to avoid duplicates
      const newTrigger = trigger.cloneNode(true);
      trigger.parentNode.replaceChild(newTrigger, trigger);

      newTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        const item = newTrigger.closest('.faq__item');
        if (!item) return;

        const isActive = item.classList.contains('faq__item--active');
        const content = item.querySelector('.accordion__content');
        const body = item.querySelector('.accordion__body');

        if (!content || !body) return;

        // Close all siblings in the same container
        const parent = item.parentElement;
        if (parent) {
          parent.querySelectorAll('.faq__item--active').forEach((activeItem) => {
            if (activeItem !== item) {
              closeItem(activeItem);
            }
          });
        }

        if (isActive) {
          closeItem(item);
        } else {
          openItem(item, content, body);
        }
      });
    });
  };

  const openItem = (item, content, body) => {
    const bodyHeight = body.scrollHeight;
    content.style.maxHeight = bodyHeight + 'px';
    item.classList.add('faq__item--active');
  };

  const closeItem = (item) => {
    const content = item.querySelector('.accordion__content');
    if (content) {
      content.style.maxHeight = '0';
    }
    item.classList.remove('faq__item--active');
  };

  return { init, openItem, closeItem };
})();
