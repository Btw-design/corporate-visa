# BTW Visa Corporate Website — Design Audit Report

**Audit URL:** https://btw-design.github.io/corporate-visa/  
**Date:** July 8, 2026  
**Scope:** Full design, layout, UX, code quality, and deployment audit  

---

## 🔴 CRITICAL ISSUE #1: All Asset Paths Broken (Zero CSS/JS/Images Load)

**Severity:** 🔴 Critical (Site-Breaking)

### Problem
Every single HTML page uses absolute paths starting with `/`:
```html
<link rel="stylesheet" href="/assets/css/style.css">
<script src="/assets/js/app.js" defer></script>
<img src="/assets/images/hero-banner.svg">
```

On GitHub Pages, the site is served from `https://btw-design.github.io/corporate-visa/`, but paths starting with `/` resolve to `https://btw-design.github.io/` (the root of the GitHub Pages user domain), NOT to `https://btw-design.github.io/corporate-visa/`.

### Impact
| Resource Type | Path Used | Correct Path | Status |
|---|---|---|---|
| CSS (`style.css`) | `/assets/css/style.css` | `/corporate-visa/assets/css/style.css` | **404** |
| JS (`app.js`) | `/assets/js/app.js` | `/corporate-visa/assets/js/app.js` | **404** |
| JS (`navigation.js`) | `/assets/js/navigation.js` | `/corporate-visa/assets/js/navigation.js` | **404** |
| JS (`search.js`) | `/assets/js/search.js` | `/corporate-visa/assets/js/search.js` | **404** |
| JS (`accordion.js`) | `/assets/js/accordion.js` | `/corporate-visa/assets/js/accordion.js` | **404** |
| JS (`faq.js`) | `/assets/js/faq.js` | `/corporate-visa/assets/js/faq.js` | **404** |
| JS (`forms.js`) | `/assets/js/forms.js` | `/corporate-visa/assets/js/forms.js` | **404** |
| JS (`lazyload.js`) | `/assets/js/lazyload.js` | `/corporate-visa/assets/js/lazyload.js` | **404** |
| JS (`analytics.js`) | `/assets/js/analytics.js` | `/corporate-visa/assets/js/analytics.js` | **404** |
| Hero image | `/assets/images/hero-banner.svg` | `/corporate-visa/assets/images/hero-banner.svg` | **404** |
| Data (`countries.json`) | `/data/countries.json` | `/corporate-visa/data/countries.json` | **404** |
| Favicon | `/favicon.ico` | `/corporate-visa/favicon.ico` | **404** |
| Manifest | `/manifest.json` | `/corporate-visa/manifest.json` | **404** |
| Country flags | `/assets/images/flags/india.svg` | `/corporate-visa/assets/images/flags/india.svg` | **404** |
| Country images | `/assets/images/countries/india.jpg` | `/corporate-visa/assets/images/countries/india.jpg` | **404** |

### Fix
**Every single path in every HTML file must be changed.** There are two approaches:

**Option A (Recommended):** Use relative paths (no leading `/`):
```html
<link rel="stylesheet" href="assets/css/style.css">
<script src="assets/js/app.js" defer></script>
```

**Option B:** Add a `<base>` tag or use absolute paths with the repo name:
```html
<link rel="stylesheet" href="/corporate-visa/assets/css/style.css">
```

**Option C:** Set up a custom domain (e.g., `btwvisa.com`) so `/` resolves correctly.

> ⚠️ **Option A requires changing the path depth for subpages.** In `/about/index.html`, the path would be `../assets/css/style.css`. Option B is simpler for GitHub Pages but breaks if you move to a custom domain. **For Hostinger deployment** (the actual target), Option A with a custom domain is correct — paths like `/assets/css/style.css` will work perfectly at the root domain. The GitHub Pages deployment is what reveals the path issue.

---

## 🔴 CRITICAL ISSUE #2: No JavaScript Functionality

**Severity:** 🔴 Critical

### Problem
All 8 JavaScript files return 404. This means:
- **Navigation toggle** (mobile menu) — ❌ broken
- **Search** — ❌ broken
- **Accordion/FAQ** — ❌ broken (FAQ stays closed)
- **Form validation** — ❌ broken
- **Lazy loading** — ❌ broken
- **Analytics** — ❌ broken
- **Back to top button** — ❌ broken
- **Cookie consent** — ❌ broken
- **Scroll animations** — ❌ broken (all `.animate` elements stay invisible)
- **Dynamic country grid** — ❌ broken (falls back to inline data on homepage)
- **Dynamic blog posts** — ❌ broken (shows "Blog posts loading..." permanently)
- **Dynamic testimonials** — ❌ broken (shows "Testimonials loading..." permanently)

### Impact
The site is completely static with no interactivity. The country grid on the homepage loads a basic fallback (when CSS is loaded), but blog posts, testimonials, and FAQs are permanently stuck in a "loading" state.

---

## 🔴 CRITICAL ISSUE #3: Missing Contact Page

**Severity:** 🔴 High

### Problem
`/contact-us/index.html` returns **404** — the contact form page doesn't exist on the live site.

### Fix
Create the contact page file and deploy it. Verify the file exists at `contact-us/index.html` in the repository.

---

## 🟡 ISSUE #4: Missing Image Assets (Hero, Flags, Country Images, Favicon)

**Severity:** 🟡 High

### Problem
All image assets referenced in the code don't exist:
- `/assets/images/hero-banner.svg` — 404 (hero illustration)
- `/assets/images/countries/india.jpg` — 404 (country images)
- `/assets/images/flags/india.svg` — 404 (country flags)
- `/assets/images/og-image.jpg` — 404 (social share image)
- `/favicon.ico` — 404
- `/assets/icons/apple-touch-icon.png` — 404

### Fix
Create all referenced image assets. Minimum requirements:
1. Hero illustration (SVG or WebP, 1200x800)
2. Country flags (SVG, 64x48px each for 193 countries — can use `flagcdn.com` CDN as fallback)
3. Country images (JPG/WebP, 800x600)
4. Favicon (`.ico`, 32x32)
5. Apple touch icon (PNG, 180x180)
6. OG image (JPG, 1200x630)

---

## 🟡 ISSUE #5: CSS Architecture — @import Blocks Rendering

**Severity:** 🟡 High (Performance)

### Problem
`style.css` uses `@import` to load all other CSS files:
```css
@import url('reset.css');
@import url('variables.css');
@import url('typography.css');
/* ... 6 more @imports */
```

`@import` blocks the rendering pipeline — each import must be fetched sequentially, not in parallel. This delays the First Contentful Paint (FCP) and Largest Contentful Paint (LCP).

### Fix
**Concatenate all CSS into a single file** for production. Build process:
1. During development, keep separate CSS files
2. For deployment, concatenate and minify into a single `style.min.css`
3. Remove all `@import` statements
4. Load the single file in `<head>`

Since this is a no-build-tool project, **manually concatenate the files** or use a simple PowerShell script:
```powershell
Get-Content reset.css, variables.css, typography.css, layout.css, components.css, utilities.css, animations.css, forms.css, responsive.css | Set-Content style.min.css
```

---

## 🟡 ISSUE #6: Missing Image Alt Text & SEO Attributes

**Severity:** 🟡 Medium

### Problem
- Many images have no `alt` text or use `alt=""` when they should be descriptive
- Country flag images lack proper `alt` attributes (e.g., `alt="India flag"`)
- Missing `width`/`height` attributes on images (causes CLS)

### Fix
Add proper `alt`, `width`, and `height` to every `<img>` tag:
```html
<img src="assets/images/flags/india.svg" 
     alt="Flag of India" 
     width="64" 
     height="48"
     loading="lazy">
```

---

## 🟡 ISSUE #7: Subpage Design Inconsistencies

**Severity:** 🟡 Medium

### Problems found on subpages (About, Services, etc.):

| Page | Issue |
|---|---|
| **About** | `.page-header` has 0 padding (CSS not loading). Stats section uses `stats-grid` class but layout is single-column on mobile. |
| **Services** | Service detail cards use `grid--2` which collapses to 1 column on mobile — acceptable but the visual hierarchy is flat. |
| **Visa Guide** | Country grid uses `country-grid` which works but flags are missing (404). |
| **India Visa** | Embassy section shows "Map placeholder" text — should have an actual embedded map or remove the section. |
| **All subpages** | `page-header` has `margin-top: var(--header-height)` but the background gradient and padding only work when CSS loads. |

---

## 🟡 ISSUE #8: Typography Refinements

**Severity:** 🟡 Medium

### Problems

| Element | Current | Issue |
|---|---|---|
| **Hero H1 (mobile)** | 20px/23px | Too small for a hero headline on mobile. Should be minimum 28-32px |
| **Hero H1 (desktop)** | `clamp(2.5rem, 5vw, 4rem)` | Potentially 64px on large screens — fine, but 40px would be more elegant |
| **Body text** | 16px, #4b5563 (gray-600) | Slightly low contrast. Gray-700 (#374151) is recommended for body text |
| **Section titles** | 24px (mobile) | Good, but could use `clamp(1.5rem, 3vw, 2.25rem)` for fluid sizing |
| **Section tag** | `#1a56db` blue | Good color, but the dot `::before` pseudo-element adds 8px radius — very small. Could be more prominent |

### Recommendations
```css
/* Hero title on mobile */
@media (max-width: 576px) {
  .hero__title {
    font-size: var(--text-3xl); /* 30px minimum */
  }
}

/* Better body text contrast */
:root {
  --color-text-secondary: #374151; /* gray-700 instead of gray-600 */
}
```

---

## 🟡 ISSUE #9: Color & Visual Hierarchy

**Severity:** 🟡 Medium

### Problems

1. **`--color-bg-secondary: #f9fafb` (gray-50)** — Almost indistinguishable from white (#ffffff). Sections that use `.section--muted` barely look different.

2. **Button hover effect** — `translateY(-1px)` is almost imperceptible. Should be more pronounced.

3. **Card borders** — `1px solid #e5e7eb` with no default shadow makes cards look flat. Consider a subtle shadow even in resting state.

4. **Hero gradient** — The `#f9fafb` to `#ffffff` gradient is barely visible. A more pronounced gradient would create better visual separation.

5. **Process section** — The dashed connector lines between steps only work on desktop and might break at certain breakpoints.

### Recommendations
```css
/* Make muted sections more distinct */
:root {
  --color-bg-secondary: #f3f4f6; /* gray-100 instead of gray-50 */
}

/* Better card resting state */
.card {
  box-shadow: var(--shadow-xs); /* subtle shadow by default */
}

/* Better button hover */
.btn--primary:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

/* More visible hero gradient */
.hero {
  background: linear-gradient(135deg, #f3f4f6 0%, #ffffff 100%);
}
```

---

## 🟡 ISSUE #10: Responsive Design Gaps

**Severity:** 🟡 Medium

### Problems identified from computed styles (320px viewport)

| Issue | Detail | Fix |
|---|---|---|
| **Container padding** | `clamp(1rem, 3vw, 2rem)` → at 320px, 3vw = 9.6px → `1rem = 16px` wins. But computed shows only 16px. | At < 480px, use 12px padding instead of 16px |
| **Grid auto-fit** | `repeat(auto-fit, minmax(280px, 1fr))` at 320px viewport gives 280px columns → overflows by 32px gap. | Change to `minmax(260px, 1fr)` for tighter mobile grids |
| **Hero image** | On mobile, hero image takes full width but max-width:80% limits it unnecessarily. | Remove max-width restriction on mobile |
| **Stats grid** | 3 columns at 320px is very tight. Each stat has limited horizontal space. | Switch to 1 column at < 480px for stats |
| **Service cards** | `services-grid` with `minmax(280px, 1fr)` — horizontal scroll risk at 320px. | Add `overflow: hidden` to parent |
| **Country pills** | `minmax(180px, 1fr)` creates 2-column grid on 320px — pills get very narrow. | Switch to 1 column at < 480px |

---

## 🟡 ISSUE #11: Font Loading Optimization

**Severity:** 🟡 Medium

### Problem
- Fonts are loaded via `@font-face` in `style.css` with `font-display: swap` — good
- But `@font-face` is inside an `@import`-ed file, which delays font loading
- The `preconnect` hints are present but preloaded fonts are behind `@import`

### Fix
1. Move `@font-face` declarations to a `<style>` block in `<head>` (critical CSS)
2. Keep `preconnect` and `preload` hints
3. Use `font-display: swap` (already done)

---

## 🔵 ISSUE #12: Accessibility Gaps (WCAG 2.2)

**Severity:** 🔵 Low-Medium

| Issue | Location | Fix |
|---|---|---|
| Skip link text | "Skip to main content" — present but may not be visible on focus | Verify it becomes visible when tabbed to |
| ARIA labels on search | Present ✅ | — |
| Focus indicators | `:focus-visible` defined in reset.css ✅ | Works |
| Color contrast | Body text #4b5563 on white → ratio 5.6:1 (passes AA for 14pt+). For 16px text, needs 4.5:1 ✅ | Just barely passes |
| Missing form labels | Newsletter form uses `aria-label` ✅ | But could use explicit `<label>` |
| Mobile menu | ARIA attributes present ✅ | `aria-expanded` toggles |

---

## 🔵 ISSUE #13: Missing Performance Optimizations

**Severity:** 🔵 Low

### Opportunities
1. **CSS is not minified** — All 10 CSS files are unminified
2. **JS is not minified** — All 8 JS files are unminified
3. **No service worker** — No offline capability
4. **No resource hints** — `prefetch`/`preload` only for fonts and hero image
5. **Images not optimized** — No WebP/AVIF formats used, no responsive `srcset`

---

## 📋 COMPLETE FIX CHECKLIST (Priority Order)

### Phase 1 — Critical (Do immediately)
- [ ] **P1-1:** Fix all asset paths — change from `/assets/...` to `assets/...` (relative) or `/corporate-visa/assets/...` (GitHub Pages absolute)
- [ ] **P1-2:** Create the missing `contact-us/index.html` page
- [ ] **P1-3:** Verify all pages deploy and render with CSS/JS

### Phase 2 — High Priority
- [ ] **P2-1:** Create all missing image assets (hero illustration, flags, country images, favicon, OG image)
- [ ] **P2-2:** Replace placeholder flag images with CDN fallback (e.g., `https://flagcdn.com/w40/in.png`)
- [ ] **P2-3:** Concatenate and minify CSS (remove `@import`, use single `style.min.css`)
- [ ] **P2-4:** Concatenate and minify JS (single `app.min.js`)
- [ ] **P2-5:** Add missing `alt`, `width`, `height` to all images

### Phase 3 — Design Refinements
- [ ] **P3-1:** Increase hero H1 size on mobile (target: 28-32px)
- [ ] **P3-2:** Improve muted section contrast (use `--color-gray-100` instead of `--color-gray-50`)
- [ ] **P3-3:** Add subtle default shadow to cards
- [ ] **P3-4:** Improve button hover effects (more pronounced lift)
- [ ] **P3-5:** Fix hero gradient to be more visible
- [ ] **P3-6:** Improve mobile responsive grids (adjust `minmax` values)
- [ ] **P3-7:** Fix hero image max-width on mobile
- [ ] **P3-8:** Adjust stats grid columns on mobile
- [ ] **P3-9:** Move `@font-face` to inline `<style>` in `<head>`

### Phase 4 — Polish & Performance
- [ ] **P4-1:** Add WebP/AVIF image formats with `<picture>` fallback
- [ ] **P4-2:** Implement responsive images with `srcset`
- [ ] **P4-3:** Add `prefetch` hints for key subpages
- [ ] **P4-4:** Minify all CSS/JS for deployment
- [ ] **P4-5:** Verify all meta tags (OG, Twitter, Schema)
- [ ] **P4-6:** Run Lighthouse audit and fix any remaining issues
- [ ] **P4-7:** Test on real mobile devices (iPhone, Android)

### Phase 5 — Future-Proofing
- [ ] **P5-1:** Set up custom domain (`btwvisa.com`) so paths work correctly
- [ ] **P5-2:** Add service worker for offline support
- [ ] **P5-3:** Set up proper CI/CD for automated builds
- [ ] **P5-4:** Add automated Lighthouse CI checks

---

## Summary

The website's codebase has a solid architecture (good CSS variable system, well-structured components, proper HTML semantics), but **the #1 problem making the site look unprofessional is that 100% of assets fail to load** due to incorrect path resolution on GitHub Pages.

Once the asset path issue is fixed, the remaining design issues are refinements: typography sizing on mobile, color contrast improvements, image creation, and responsive grid adjustments. The fundamental architecture is sound.

**Estimated effort to fix all issues:**
- Phase 1 (paths): ~2 hours (find/replace across all files)
- Phase 2 (images): ~4 hours (create/generate assets)
- Phase 3 (design): ~6 hours (CSS refinements)
- Phase 4 (perf): ~4 hours (minification, optimization)
