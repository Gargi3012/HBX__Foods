# Changelog

All notable changes to the **HBX Foods** export portal and interactive catalogue will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [1.2.0] - 2026-09-09

### Added
- **20-Ton FCL Mix Builder Engine (`container-bag.js` & `container-bag.css`):**
  - Zero-dependency reactive drawer calculating cumulative payload against 20.0 Metric Ton shipping capacity.
  - Three real-time load thresholds: LCL mode warning, 100% FCL optimization state, and Multi-Container 40ft HC prompt.
  - LocalStorage persistence (`hbx_container_bag`) preserving buyer product selections across page transitions.
  - Direct WhatsApp B2B export integration formulating detailed consignment breakdowns with destination seaport routing.
- **Comprehensive Documentation Suite:**
  - Upgraded `README.md` with enterprise B2B export manual, ASCII architecture diagrams, and port logistics.
  - `DEVLOG.md` recording technical milestones, aesthetic philosophy, and reactive state choices.
  - `docs/EXPORT_SPECIFICATIONS.md` detailing physicochemical standards, microbiological thresholds, and container stuffing standards.
  - Continuous integration static workflow for GitHub Pages deployment.

### Changed
- Replaced floating dock navigation on mobile devices with high-contrast top-bar bag counter badges.
- Enhanced card layout on handheld viewports to a compact, scannable 2-column grid.

---

## [1.1.0] - 2026-09-08

### Added
- Imperial Gold (`#D4AF37`) and Saffron Muse design tokens across all category catalog pages.
- Category quick-switcher navigation bar across `dehydrated.html`, `whole-spices.html`, `seeds.html`, and `ground-spices.html`.
- High-resolution SVG icons and official HBX Foods circular crest emblems.

### Changed
- Refactored typography to *Cormorant Garamond* (headings) and *Plus Jakarta Sans* (body and tables).
- Standardized product specification cards with tabular physicochemical data.

---

## [1.0.0] - 2026-09-05

### Added
- Initial release of the HBX Foods global B2B export portal.
- Four core export commodity catalogs:
  - Dehydrated vegetables (white & red onion flakes, minced garlic, pure powder).
  - Whole & exotic spices (Alleppey cardamom, Kashmiri saffron, star anise, sonth).
  - Sortex clean seeds (99.95% hulled sesame, natural sesame, cumin seeds, kalonji).
  - Ground spices and cryogenic blends (high-curcumin turmeric, Kashmiri red chilli, garam masala).
- Contact desk with direct phone, WhatsApp, and email routing for international buyers.
