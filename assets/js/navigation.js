/* ==========================================================================
   Navigation — Header, Mobile Menu, Mega Menu
   ========================================================================== */

'use strict';

const Navigation = (() => {
  'use strict';

  // --- Private ---

  let isMenuOpen = false;

  const toggleMenu = () => {
    const nav = document.querySelector('.nav');
    const toggleBtn = document.querySelector('.nav__toggle');
    if (!nav || !toggleBtn) return;

    isMenuOpen = !isMenuOpen;
    nav.classList.toggle('nav--open', isMenuOpen);
    toggleBtn.setAttribute('aria-expanded', isMenuOpen);
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';

    // Update toggle icon
    const icon = toggleBtn.querySelector('svg');
    if (icon) {
      if (isMenuOpen) {
        icon.innerHTML = `
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" 
                d="M6 18L18 6M6 6l12 12"/>
        `;
      } else {
        icon.innerHTML = `
          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" 
                d="M4 6h16M4 12h16M4 18h16"/>
        `;
      }
    }
  };

  const closeMenu = () => {
    if (!isMenuOpen) return;
    toggleMenu();
  };

  const handleHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    if (window.scrollY > 50) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  };

  const handleKeydown = (e) => {
    if (e.key === 'Escape' && isMenuOpen) {
      closeMenu();
    }
  };

  const handleClickOutside = (e) => {
    if (!isMenuOpen) return;
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav__toggle');
    if (!nav || !toggle) return;

    if (!nav.contains(e.target) && !toggle.contains(e.target)) {
      closeMenu();
    }
  };

  // --- Public ---

  const init = () => {
    // Toggle button
    const toggleBtn = document.querySelector('.nav__toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', toggleMenu);
    }

    // Close mobile menu on link click
    document.querySelectorAll('.nav__link, .mega-menu__link').forEach((link) => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // Scroll effect
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });

    // Keyboard
    document.addEventListener('keydown', handleKeydown);

    // Click outside
    document.addEventListener('click', handleClickOutside);

    // Close on resize from mobile to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
      }
    });

    // Set initial state
    if (toggleBtn) {
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.setAttribute('aria-label', 'Toggle navigation menu');
    }
  };

  return { init };
})();
