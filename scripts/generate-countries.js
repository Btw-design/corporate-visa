/**
 * Country Visa Page Generator
 * ============================
 * 
 * Generates complete HTML visa pages for all countries from the data file.
 * Run with Node.js: node scripts/generate-countries.js
 * 
 * Each country page follows the same template structure with dynamic content
 * from /data/countries.json.
 * 
 * Output: /visa-guide/{country-slug}/index.html
 */

const fs = require('fs');
const path = require('path');

// Load country data
const countriesPath = path.join(__dirname, '..', 'data', 'countries.json');
const countries = JSON.parse(fs.readFileSync(countriesPath, 'utf-8'));

// Template for country visa guide page
function generateCountryPage(country) {
  const {
    id, name, slug, flag, visaFee, processingTime, visaType, validity,
    description, continent, visaTypes, documents, embassy, faqs
  } = country;

  // Generate FAQ items
  const faqItems = (faqs || [
    { question: `What types of visas are available for ${name}?`, answer: `${name} offers ${visaType} visas. The specific type depends on the purpose of your visit.` },
    { question: `How long does it take to process a ${name} visa?`, answer: `The processing time for a ${name} visa is typically ${processingTime}. Express processing may be available for an additional fee.` },
    { question: `What documents are required for a ${name} business visa?`, answer: `Required documents generally include a valid passport, completed application form, passport photos, business invitation letter, company registration proof, and travel itinerary.` },
    { question: `What is the visa fee for ${name}?`, answer: `The visa fee for ${name} starts from ${visaFee}. Fees vary based on visa type, processing speed, and nationality.` },
  ]);

  const faqSchema = faqItems.map((faq, i) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: { '@type': 'Answer', text: faq.answer }
  }));

  // Related countries (same continent)
  const related = countries
    .filter(c => c.continent === continent && c.id !== id)
    .slice(0, 4);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${name} Visa — Fees, Processing Time & Requirements | BTW Visa</title>
  <meta name="description" content="Complete guide to ${name} visa for business travelers. Check visa fees, processing time, required documents, and embassy details. Apply with BTW Visa.">
  <meta name="keywords" content="${name.toLowerCase()} visa, business visa ${name.toLowerCase()}, ${name.toLowerCase()} visa fees, visa processing time">
  <link rel="canonical" href="https://www.btwvisa.com/visa-guide/${slug}/">

  <meta property="og:type" content="article">
  <meta property="og:url" content="https://www.btwvisa.com/visa-guide/${slug}/">
  <meta property="og:title" content="${name} Visa Guide | BTW Visa">
  <meta property="og:description" content="Complete guide to ${name} visa including fees, processing time, documents, and embassy information.">

  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${name} Visa Guide | BTW Visa">
  <meta name="twitter:description" content="Complete guide to ${name} visa for business travelers.">

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.btwvisa.com/" },
      { "@type": "ListItem", "position": 2, "name": "Visa Guide", "item": "https://www.btwvisa.com/visa-guide/" },
      { "@type": "ListItem", "position": 3, "name": "${name} Visa", "item": "https://www.btwvisa.com/visa-guide/${slug}/" }
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": ${JSON.stringify(faqSchema, null, 2)}
  }
  </script>

  <link rel="icon" type="image/x-icon" href="/favicon.ico">
  <link rel="apple-touch-icon" sizes="180x180" href="/assets/icons/apple-touch-icon.png">
  <link rel="manifest" href="/manifest.json">

  <link rel="preconnect" href="https://fonts.googleapis.com" crossorigin>
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

  <link rel="stylesheet" href="/assets/css/style.css" media="all">
</head>
<body>
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header class="header" role="banner">
    <div class="container header__inner">
      <a href="/" class="header__logo" aria-label="BTW Visa Home">
        <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="40" height="40" rx="10" fill="#1a56db"/>
          <path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span class="header__logo-text">BTW <span>Visa</span></span>
      </a>
      <nav class="nav" role="navigation" aria-label="Main navigation">
        <ul class="nav__list" role="menubar">
          <li class="nav__item" role="none"><a href="/" class="nav__link" role="menuitem">Home</a></li>
          <li class="nav__item" role="none"><a href="/about/" class="nav__link" role="menuitem">About Us</a></li>
          <li class="nav__item nav__item--has-mega" role="none">
            <a href="/our-services/" class="nav__link" role="menuitem" aria-haspopup="true">Services <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg></a>
            <div class="mega-menu" role="menu">
              <div class="mega-menu__grid">
                <div class="mega-menu__section">
                  <h3 class="mega-menu__heading">Visa Services</h3>
                  <div class="mega-menu__items">
                    <a href="/business-visa-assistance/" class="mega-menu__link" role="menuitem">Business Visa Assistance</a>
                    <a href="/evisa/" class="mega-menu__link" role="menuitem">e-Visa</a>
                    <a href="/visa-tracking/" class="mega-menu__link" role="menuitem">Visa Tracking</a>
                    <a href="/passport-index/" class="mega-menu__link" role="menuitem">Passport Index</a>
                  </div>
                </div>
                <div class="mega-menu__section">
                  <h3 class="mega-menu__heading">Travel Services</h3>
                  <div class="mega-menu__items">
                    <a href="/corporate-air-ticketing/" class="mega-menu__link" role="menuitem">Corporate Air Ticketing</a>
                    <a href="/corporate-hotel-booking/" class="mega-menu__link" role="menuitem">Corporate Hotel Booking</a>
                    <a href="/corporate-holiday-packages/" class="mega-menu__link" role="menuitem">Corporate Holiday Packages</a>
                    <a href="/ok-to-board/" class="mega-menu__link" role="menuitem">Ok to Board</a>
                  </div>
                </div>
              </div>
            </div>
          </li>
          <li class="nav__item" role="none"><a href="/visa-guide/" class="nav__link nav__link--active" role="menuitem" aria-current="page">Visa Guide</a></li>
          <li class="nav__item" role="none"><a href="/insights/" class="nav__link" role="menuitem">Insights</a></li>
          <li class="nav__item" role="none"><a href="/contact-us/" class="nav__link" role="menuitem">Contact Us</a></li>
        </ul>
        <div class="search d-none d-md-block">
          <svg class="search__icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <input type="search" class="search__input" placeholder="Search destinations..." aria-label="Search">
          <div class="search__results"></div>
        </div>
      </nav>
      <button class="nav__toggle" aria-label="Toggle navigation menu" aria-expanded="false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </header>

  <main id="main-content">
    <div class="container">
      <nav class="breadcrumb" aria-label="Breadcrumb">
        <span class="breadcrumb__item"><a href="/" class="breadcrumb__link">Home</a></span>
        <span class="breadcrumb__item"><a href="/visa-guide/" class="breadcrumb__link">Visa Guide</a></span>
        <span class="breadcrumb__item"><span class="breadcrumb__current" aria-current="page">${name} Visa</span></span>
      </nav>
    </div>

    <section class="country-hero" aria-labelledby="country-name">
      <div class="container">
        <div class="country-hero__inner">
          <img src="/assets/images/flags/${id}.svg" alt="Flag of ${name}" class="country-hero__flag" width="80" height="60" onerror="this.style.display='none'">
          <div class="country-hero__info">
            <h1 id="country-name" class="country-hero__name">${name} Visa Guide</h1>
            <p class="lead">${description || 'Complete visa information including requirements, fees, processing time, and application process.'}</p>
            <div class="country-hero__meta">
              <span class="country-hero__meta-item"><strong>Visa Fee:</strong> ${visaFee}</span>
              <span class="country-hero__meta-item"><strong>Processing:</strong> ${processingTime}</span>
              <span class="country-hero__meta-item"><strong>Visa Type:</strong> ${visaType}</span>
              <span class="country-hero__meta-item"><strong>Validity:</strong> ${validity}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--sm" aria-label="Visa at a glance">
      <div class="container">
        <div class="visa-info">
          <div class="visa-info__item animate">
            <div class="visa-info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg></div>
            <span class="visa-info__label">Visa Fee</span>
            <span class="visa-info__value">${visaFee}</span>
          </div>
          <div class="visa-info__item animate">
            <div class="visa-info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg></div>
            <span class="visa-info__label">Processing Time</span>
            <span class="visa-info__value">${processingTime}</span>
          </div>
          <div class="visa-info__item animate">
            <div class="visa-info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg></div>
            <span class="visa-info__label">Visa Types</span>
            <span class="visa-info__value">${visaType}</span>
          </div>
          <div class="visa-info__item animate">
            <div class="visa-info__icon"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
            <span class="visa-info__label">Validity</span>
            <span class="visa-info__value">${validity}</span>
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted" aria-labelledby="about-visa-title">
      <div class="container">
        <div class="grid grid--2">
          <div class="animate">
            <span class="section__tag">Overview</span>
            <h2 id="about-visa-title" class="h2">${name} Visa Information</h2>
            <p>${name} offers a range of visa options for business travelers, tourists, and corporate visitors. Whether you're attending meetings, conferences, or exploring business opportunities, we provide complete visa assistance.</p>
            <p>BTW Visa provides end-to-end assistance for all ${name} visa types, ensuring a smooth and hassle-free application process for your corporate travel needs.</p>
            <a href="/contact-us/" class="btn btn--primary">Apply for ${name} Visa</a>
          </div>
          <div class="animate">
            <img src="/assets/images/countries/${id}.jpg" alt="${name} travel and visa guide" class="rounded-xl shadow-md" width="560" height="400" loading="lazy" onerror="this.style.display='none'">
          </div>
        </div>
      </div>
    </section>

    <section class="section section--muted" aria-labelledby="process-country-title">
      <div class="container">
        <div class="section__header">
          <span class="section__tag">Process</span>
          <h2 id="process-country-title" class="section__title">How to Apply for ${name} Visa</h2>
        </div>
        <div class="process">
          <div class="process__step animate"><div class="process__number">1</div><h3 class="process__title">Submit Documents</h3><p class="process__text">Upload your passport, photos, and business documents.</p></div>
          <div class="process__step animate"><div class="process__number">2</div><h3 class="process__title">Application Review</h3><p class="process__text">Our experts review and verify all documents for accuracy.</p></div>
          <div class="process__step animate"><div class="process__number">3</div><h3 class="process__title">Visa Submission</h3><p class="process__text">We submit the application to the embassy or visa portal.</p></div>
          <div class="process__step animate"><div class="process__number">4</div><h3 class="process__title">Visa Issuance</h3><p class="process__text">Receive your visa confirmation via email.</p></div>
        </div>
      </div>
    </section>

    <section class="section" aria-labelledby="faq-country-title">
      <div class="container container--narrow">
        <div class="section__header">
          <span class="section__tag">FAQ</span>
          <h2 id="faq-country-title" class="section__title">${name} Visa FAQs</h2>
        </div>
        <div class="faq">
          ${faqItems.map((faq, i) => `
          <div class="faq__item">
            <button class="accordion__trigger" aria-expanded="false" aria-controls="faq-${i}">
              <span>${faq.question}</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14"/><path d="M5 12h14"/></svg>
            </button>
            <div class="accordion__content" id="faq-${i}" role="region">
              <div class="accordion__body"><p>${faq.answer}</p></div>
            </div>
          </div>`).join('\\n          ')}
        </div>
      </div>
    </section>

    <section class="section section--muted" aria-labelledby="related-title">
      <div class="container">
        <div class="section__header section__header--left">
          <span class="section__tag">Related</span>
          <h2 id="related-title" class="section__title">Related Visa Guides</h2>
        </div>
        <div class="grid grid--auto">
          ${related.map(c => `
          <a href="/visa-guide/${c.id}/" class="card card--country animate" style="aspect-ratio:4/3;background:linear-gradient(135deg, var(--color-gray-800), var(--color-gray-900));display:flex;align-items:flex-end;padding:var(--space-6);text-decoration:none;">
            <div>
              <h3 style="color:var(--color-white);font-size:var(--text-lg);font-weight:var(--font-weight-semibold);">${c.name} Visa</h3>
              <p style="color:var(--color-gray-400);font-size:var(--text-sm);margin:0;">View visa requirements →</p>
            </div>
          </a>`).join('\\n          ')}
        </div>
      </div>
    </section>

    <section class="cta" aria-labelledby="cta-country-title">
      <div class="container">
        <h2 id="cta-country-title" class="cta__title">Ready to Apply for Your ${name} Visa?</h2>
        <p class="cta__text">Our visa experts will guide you through every step. Get started today.</p>
        <div class="cta__actions">
          <a href="/contact-us/" class="btn btn--lg" style="background:white;color:var(--color-primary);">Apply Now</a>
          <a href="/business-visa-assistance/" class="btn btn--ghost btn--lg">Learn About Our Services</a>
        </div>
      </div>
    </section>
  </main>

  <footer class="footer" role="contentinfo">
    <div class="container">
      <div class="footer__inner">
        <div class="footer__brand">
          <a href="/" class="footer__logo">
            <svg width="36" height="36" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="40" height="40" rx="10" fill="#1a56db"/>
              <path d="M12 20L18 26L28 14" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <span class="footer__logo-text">BTW <span>Visa</span></span>
          </a>
          <p class="footer__about">BTW Visa is a leading corporate visa and travel solutions provider, serving enterprises across 180+ countries.</p>
          <div class="footer__social">
            <a href="https://linkedin.com/company/btwvisa" class="footer__social-link" aria-label="LinkedIn" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg></a>
            <a href="https://facebook.com/btwvisa" class="footer__social-link" aria-label="Facebook" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg></a>
            <a href="https://twitter.com/btwvisa" class="footer__social-link" aria-label="Twitter" target="_blank" rel="noopener"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
          </div>
        </div>
        <div><h3 class="footer__heading">Quick Links</h3><ul class="footer__links">
          <li><a href="/" class="footer__link">Home</a></li><li><a href="/about/" class="footer__link">About Us</a></li>
          <li><a href="/contact-us/" class="footer__link">Contact Us</a></li><li><a href="/why-choose-us/" class="footer__link">Why Choose Us</a></li>
          <li><a href="/our-services/" class="footer__link">Our Services</a></li>
        </ul></div>
        <div><h3 class="footer__heading">Visa Services</h3><ul class="footer__links">
          <li><a href="/business-visa-assistance/" class="footer__link">Business Visa</a></li><li><a href="/evisa/" class="footer__link">e-Visa</a></li>
          <li><a href="/passport-index/" class="footer__link">Passport Index</a></li><li><a href="/visa-tracking/" class="footer__link">Visa Tracking</a></li>
          <li><a href="/visa-guide/" class="footer__link">Visa Guide</a></li>
        </ul></div>
        <div><h3 class="footer__heading">Travel Services</h3><ul class="footer__links">
          <li><a href="/corporate-air-ticketing/" class="footer__link">Air Ticketing</a></li><li><a href="/corporate-hotel-booking/" class="footer__link">Hotel Booking</a></li>
          <li><a href="/corporate-holiday-packages/" class="footer__link">Holiday Packages</a></li><li><a href="/ok-to-board/" class="footer__link">Ok to Board</a></li>
        </ul></div>
      </div>
      <div class="footer__bottom">
        <p class="footer__copyright">&copy; 2026 BTW Visa. All rights reserved.</p>
        <div class="footer__legal">
          <a href="/privacy-policy/" class="footer__legal-link">Privacy Policy</a>
          <a href="/terms-conditions/" class="footer__legal-link">Terms of Service</a>
          <a href="/refund-policy/" class="footer__legal-link">Refund Policy</a>
        </div>
      </div>
    </div>
  </footer>

  <button class="back-to-top" data-back-to-top aria-label="Back to top">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>
  </button>

  <div class="cookie-bar" data-cookie-bar role="dialog" aria-label="Cookie consent">
    <div class="container">
      <div class="cookie-bar__inner">
        <p class="cookie-bar__text">We use cookies to enhance your experience.</p>
        <div class="cookie-bar__actions">
          <button class="btn btn--sm btn--ghost" data-cookie-decline style="color:white;border-color:rgba(255,255,255,0.3);">Decline</button>
          <button class="btn btn--sm" data-cookie-accept style="background:var(--color-primary);color:white;">Accept</button>
        </div>
      </div>
    </div>
  </div>

  <script src="/assets/js/app.js" defer></script>
  <script src="/assets/js/navigation.js" defer></script>
  <script src="/assets/js/search.js" defer></script>
  <script src="/assets/js/accordion.js" defer></script>
  <script src="/assets/js/faq.js" defer></script>
  <script src="/assets/js/forms.js" defer></script>
  <script src="/assets/js/lazyload.js" defer></script>
  <script src="/assets/js/analytics.js" defer></script>
</body>
</html>`;
}

// --- Main ---
function main() {
  console.log(\`Generating \${countries.length} country visa pages...\n\`);

  const outputDir = path.join(__dirname, '..', 'visa-guide');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let count = 0;
  countries.forEach((country) => {
    const countryDir = path.join(outputDir, country.id);
    if (!fs.existsSync(countryDir)) {
      fs.mkdirSync(countryDir, { recursive: true });
    }

    const html = generateCountryPage(country);
    const outputPath = path.join(countryDir, 'index.html');
    fs.writeFileSync(outputPath, html, 'utf-8');
    count++;
    console.log(\`  ✓ \${country.name} (\${country.id})\`);
  });

  console.log(\`\nDone! Generated \${count} country pages.\`);
  console.log(\`Location: /visa-guide/{country-slug}/index.html\`);
}

main();
`;
