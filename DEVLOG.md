# HBX FOODS — Engineering & Design Development Log (DEVLOG)

This document chronicles the design iterations, architectural decisions, mathematical models, and frontend engineering solutions developed for **HBX Foods** — an export-focused B2B portal and 20-Ton Full Container Load (FCL) mix calculator.

---

## 📅 Chronological Milestones

### Phase 1: Brand Identity & Luxury Aesthetic System
* **Objective:** Elevate HBX Foods from a generic commodity trading site to an international luxury agri-export house.
* **Aesthetic Direction:** *Saffron Muse & Noiré Editorial*.
  - **Matte Espresso (`#12100E`):** Deep earthy black reminiscent of sun-dried whole spices.
  - **Roasted Slate (`#181512`):** Elevated card surface tone providing subtle contrast against background.
  - **Imperial Gold (`#D4AF37` / `#B8860B`):** Premium accentuation echoing turmeric and saffron value.
  - **Burnt Terracotta (`#8E3B29`):** Grounded warm red reflecting Rajasthan red chillies.
  - **Plaster Bone (`#F4ECE4`):** Soft, non-glare off-white for editorial typographic clarity.
* **Typography Hierarchy:**
  - Headings & Editorial Accents: *Cormorant Garamond* (Google Fonts serif).
  - Data Readouts, UI Controls, & Body: *Plus Jakarta Sans* (geometric clean sans).

---

### Phase 2: Category Architecture & Product Catalog
* **Structure:** Separated bulk trade into four core commodity verticals:
  1. **Dehydrated Ingredients (`dehydrated.html`):** White/Red onion flakes, minced garlic, granules, powder.
  2. **Whole & Exotic Spices (`whole-spices.html`):** Kashmiri Saffron (Mongra A++), bold 8mm Green Cardamom, Star Anise, Sonth.
  3. **Sortex Clean Seeds (`seeds.html`):** 99.95% hulled white sesame, natural sesame, cumin (jeera), kalonji, chia.
  4. **Ground Spices & Masalas (`ground-spices.html`):** High-curcumin turmeric, Kashmiri red chilli, coriander, garam masala.
* **Design Standards:**
  - Consistent header with luxury gold emblem, back-to-home navigation, quick category switchers.
  - Mobile-responsive 2-column card grid ensuring seamless scanning on handheld devices.
  - Standardized chemical & physical parameter tables (Purity %, Moisture %, Mesh Size, Packaging Type).

---

### Phase 3: The 20-Ton FCL Mix Builder Engine (`container-bag.js` & `container-bag.css`)
* **Problem Statement:** International bulk buyers rarely import single items in an entire 20-foot shipping container. Importers, hypermarket distributors, and commercial processors demand multi-product consolidated mixes (e.g., 8 Tons Onion Flakes + 6 Tons Cumin + 6 Tons Sesame Seeds = 20 Tons FCL).
* **Technical Solution:** Built a zero-dependency, reactive Vanilla JS container management drawer.
* **Key Features:**
  - **Real-Time Tonnage Accumulator:** Aggregates float tonnage values with 0.1T precision rounding to eliminate JavaScript floating-point representation drift.
  - **Dynamic State Engine:**
    - `< 20.0 Tons (LCL Mode):` Warns user of remaining capacity needed for optimal ocean container freight rates.
    - `= 20.0 Tons (100% FCL Mode):` Celebrates complete container utilization with emerald gold status indicator.
    - `> 20.0 Tons (Multi-Container Mode):` Automatically prompts for 40-Foot High-Cube or 2x 20' FCL logistics planning.
  - **Local Storage Synchronization:** Caches state locally (`hbx_container_bag`) so buyers navigating across category pages preserve their selected container mix.
  - **Direct WhatsApp Export Automation:** Serializes line items, total tonnage, company buyer name, and destination port into a clean, human-readable WhatsApp dispatch inquiry.

---

### Phase 4: UI/UX Refinement & Mobile Optimization
* **Streamlined Mobile Experience:**
  - Replaced cluttering bottom floating docks with dedicated top navigation badges.
  - Adjusted container visualizer bar height and padding for thumbs-first mobile interaction.
  - Implemented responsive touch increments (`+0.5T`, `+1.0T`, `-0.5T`) alongside direct numeric input fields.
  - Ensured non-blocking page scroll handling during drawer activation with body overflow freezing.

---

## ⚙️ Architecture & Technical Decisions

```
               [ User Browser ]
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
  index.html     category.html   container-bag.js (Global Engine)
       │               │               │
       └───────────────┴───────────────┘
                       │
         ┌─────────────┴─────────────┐
         ▼                           ▼
  Local Storage Cache          DOM Reactive Visualizer
  (State Persistence)          (FCL 20T Math & Thresholds)
         │                           │
         └─────────────┬─────────────┘
                       ▼
             [ WhatsApp B2B Export ]
             (Pre-formatted Cargo RFP)
```

### Why Zero-Dependency Vanilla JavaScript?
1. **Instantaneous Load Speed:** No bundle parsing overhead, no virtual DOM diffing latency.
2. **Portability:** Can be embedded on static CDN hosting, GitHub Pages, or any future CMS / backend seamlessly.
3. **Resilience:** Unbreakable across legacy mobile browsers commonly used by international trade brokers on port docks.

---

## 📈 Quality & Verification Matrix

- [x] Tested across Chromium, Firefox, and WebKit rendering engines.
- [x] Verified zero JavaScript console warnings and error-free DOM hydration.
- [x] Verified localStorage write/read across page transitions.
- [x] Validated responsive break-points (320px, 480px, 768px, 1024px, 1440px).
- [x] Ensured internationalized number formatting and URL encoding for seaport routing.
