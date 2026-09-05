/**
 * HBX FOODS — SMART CONTAINER CALCULATOR & EXPORT BAG ENGINE
 * Zero-dependency Vanilla JS module for 20-Ton FCL calculation,
 * slide-out drawer management, localStorage persistence, and WhatsApp checkout.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'hbx_container_bag';
  const TARGET_TONNAGE = 20.0;

  // In-memory state
  let bagItems = [];

  // Default sample items if completely empty on first visit
  const DEFAULT_INITIAL_ITEMS = [
    {
      id: 'white-onion',
      title: 'Dehydrated White Onion Flakes',
      packaging: 'Poly-lined 20kg Export Cartons',
      img: 'images/Gemini_Generated_Image_1a9yqu1a9yqu1a9y.png',
      tons: 8.0
    },
    {
      id: 'cumin-seeds',
      title: 'Sortex Clean Cumin Seeds (Jeera)',
      packaging: 'Double-layered 25kg PP Bags',
      img: 'images/image.png',
      tons: 6.0
    },
    {
      id: 'hulled-sesame',
      title: '99.95% Hulled Sesame Seeds',
      packaging: 'Food-grade 25kg Paper / PP Bags',
      img: 'images/image.png',
      tons: 6.0
    }
  ];

  function loadBag() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        bagItems = JSON.parse(saved);
      } else {
        bagItems = [...DEFAULT_INITIAL_ITEMS];
        saveBag();
      }
    } catch (e) {
      console.warn('localStorage error, using defaults', e);
      bagItems = [...DEFAULT_INITIAL_ITEMS];
    }
  }

  function saveBag() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(bagItems));
    } catch (e) {
      console.warn('Failed to save to localStorage', e);
    }
    updateNavBadges();
  }

  function getTotalTonnage() {
    const total = bagItems.reduce((sum, item) => sum + (parseFloat(item.tons) || 0), 0);
    return Math.round(total * 10) / 10;
  }

  function openContainerBag() {
    const drawer = document.getElementById('containerBagDrawer');
    const overlay = document.getElementById('containerBagOverlay');
    if (drawer && overlay) {
      renderBagDrawer();
      drawer.classList.add('is-open');
      overlay.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeContainerBag() {
    const drawer = document.getElementById('containerBagDrawer');
    const overlay = document.getElementById('containerBagOverlay');
    if (drawer && overlay) {
      drawer.classList.remove('is-open');
      overlay.classList.remove('is-active');
      document.body.style.overflow = '';
    }
  }

  function toggleContainerBag() {
    const drawer = document.getElementById('containerBagDrawer');
    if (drawer && drawer.classList.contains('is-open')) {
      closeContainerBag();
    } else {
      openContainerBag();
    }
  }

  function addToContainerBag(item) {
    const existing = bagItems.find(i => i.id === item.id);
    if (existing) {
      existing.tons = Math.round(((parseFloat(existing.tons) || 0) + (item.tons || 1.0)) * 10) / 10;
    } else {
      bagItems.push({
        id: item.id || 'item-' + Date.now(),
        title: item.title || 'Export Ingredient',
        packaging: item.packaging || 'Export Grade Packing',
        img: item.img || 'images/hbx-official-emblem.png',
        tons: item.tons || 1.0
      });
    }
    saveBag();
    renderBagDrawer();
    showBagToast(`Added +${item.tons || 1.0}T ${item.title} to Container`);
  }

  function updateItemTonnage(id, deltaOrVal, isAbsolute) {
    const item = bagItems.find(i => i.id === id);
    if (!item) return;

    if (isAbsolute) {
      let val = parseFloat(deltaOrVal);
      if (isNaN(val) || val <= 0) val = 0.5;
      item.tons = Math.round(val * 10) / 10;
    } else {
      let next = (parseFloat(item.tons) || 0) + deltaOrVal;
      if (next <= 0) {
        removeItemFromBag(id);
        return;
      }
      item.tons = Math.round(next * 10) / 10;
    }
    saveBag();
    renderBagDrawer();
  }

  function removeItemFromBag(id) {
    const item = bagItems.find(i => i.id === id);
    const title = item ? item.title : 'Item';
    bagItems = bagItems.filter(i => i.id !== id);
    saveBag();
    renderBagDrawer();
    showBagToast(`Removed ${title} from Container`);
  }

  function showBagToast(msg) {
    let toast = document.getElementById('bagToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'bagToast';
      toast.className = 'bag-toast';
      document.body.appendChild(toast);
    }
    toast.innerHTML = `
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#C5A059" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${msg}</span>
    `;
    toast.classList.add('show');
    clearTimeout(window.__bagToastTimer);
    window.__bagToastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  function updateNavBadges() {
    const total = getTotalTonnage();
    const badges = document.querySelectorAll('.bag-tonnage');
    badges.forEach(b => {
      b.textContent = `${total}T`;
    });

    const navBtns = document.querySelectorAll('.nav-bag-btn');
    navBtns.forEach(btn => {
      btn.setAttribute('aria-label', `Container Bag (${total}T loaded)`);
      if (total > 0) {
        btn.classList.add('has-items');
      } else {
        btn.classList.remove('has-items');
      }

      if (total >= TARGET_TONNAGE) {
        btn.classList.add('is-full');
      } else {
        btn.classList.remove('is-full');
      }
    });
  }

  function renderBagDrawer() {
    const total = getTotalTonnage();
    const pct = (total / TARGET_TONNAGE) * 100;

    // 1. Update Visualizer Header
    const readout = document.getElementById('bagTotalReadout');
    if (readout) readout.textContent = `${total.toFixed(1)}`;

    const pctEl = document.getElementById('bagPctReadout');
    if (pctEl) {
      if (total <= TARGET_TONNAGE) {
        pctEl.textContent = `${Math.round(pct)}% FCL Loaded`;
      } else {
        pctEl.textContent = `${Math.round(pct)}% (Multi-Container)`;
      }
    }

    const fillEl = document.getElementById('bagProgressFill');
    if (fillEl) {
      fillEl.style.width = Math.min(pct, 100) + '%';
      fillEl.className = 'bag-progress-fill';
      if (total === TARGET_TONNAGE) {
        fillEl.classList.add('fill-fcl');
      } else if (total > TARGET_TONNAGE) {
        fillEl.classList.add('fill-multi');
      }
    }

    // 2. Status Banner
    const statusBanner = document.getElementById('bagStatusBanner');
    let statusTextMode = '';
    if (statusBanner) {
      if (total < TARGET_TONNAGE) {
        const remaining = (TARGET_TONNAGE - total).toFixed(1);
        statusBanner.className = 'bag-status-banner status-lcl';
        statusBanner.innerHTML = `
          <div class="status-icon">📦</div>
          <div class="status-text">
            <strong>LCL Mode</strong>
            <span>Add <strong>${remaining} Tons</strong> more to achieve optimal Full Container Load (FCL) shipping rates.</span>
          </div>
        `;
        statusTextMode = `LCL Mode (${total.toFixed(1)} / 20 Tons)`;
      } else if (total === TARGET_TONNAGE) {
        statusBanner.className = 'bag-status-banner status-fcl';
        statusBanner.innerHTML = `
          <div class="status-icon">✓</div>
          <div class="status-text">
            <strong>100% FCL Container Optimized!</strong>
            <span>Standard 20-Foot ocean container fully loaded and ready for port dispatch.</span>
          </div>
        `;
        statusTextMode = '100% FCL Container Optimized';
      } else {
        statusBanner.className = 'bag-status-banner status-multi';
        statusBanner.innerHTML = `
          <div class="status-icon">🚢</div>
          <div class="status-text">
            <strong>Multi-Container Load (40ft High Cube)</strong>
            <span>${total.toFixed(1)} Tons total volume. Recommended for 40ft High-Cube container booking or 2x 20ft FCLs.</span>
          </div>
        `;
        statusTextMode = `Multi-Container Load (40ft High Cube - ${total.toFixed(1)} Tons)`;
      }
    }

    // 3. Render Items List
    const listEl = document.getElementById('bagItemsList');
    if (listEl) {
      if (bagItems.length === 0) {
        listEl.innerHTML = `
          <div class="bag-empty-state">
            <div class="bag-empty-icon">📦</div>
            <div class="bag-empty-title">Container Bag Empty</div>
            <div class="bag-empty-desc">Explore our export portfolio and add spices, seeds, or dehydrated cuts to plan your 20-Ton load.</div>
            <a href="index.html#categories" class="bag-empty-link" onclick="HBXContainerBag.close()">
              <span>Explore Product Range</span> →
            </a>
          </div>
        `;
      } else {
        listEl.innerHTML = bagItems.map(item => `
          <div class="bag-item-card" data-id="${item.id}">
            <div class="bag-item-thumb">
              <img src="${item.img}" alt="${item.title}" onerror="this.src='images/hbx-official-emblem.png'" />
            </div>
            <div class="bag-item-details">
              <div class="bag-item-title">${item.title}</div>
              <div class="bag-item-sub">${item.packaging || 'Export Grade Standard'}</div>
            </div>
            <div class="bag-item-actions">
              <div class="bag-stepper">
                <button type="button" class="bag-step-btn" onclick="HBXContainerBag.updateTonnage('${item.id}', -1)" aria-label="Decrease Tonnage">−</button>
                <input type="text" class="bag-step-input" value="${item.tons}T" onchange="HBXContainerBag.updateTonnage('${item.id}', this.value.replace('T',''), true)" aria-label="Tons for ${item.title}" />
                <button type="button" class="bag-step-btn" onclick="HBXContainerBag.updateTonnage('${item.id}', 1)" aria-label="Increase Tonnage">+</button>
              </div>
              <button type="button" class="bag-remove-btn" onclick="HBXContainerBag.removeItem('${item.id}')" title="Remove item" aria-label="Remove ${item.title}">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    // 4. Update WhatsApp Checkout Link
    updateWhatsAppCheckoutLink(statusTextMode);
  }

  function updateWhatsAppCheckoutLink(statusMode) {
    const checkoutBtn = document.getElementById('bagCheckoutBtn');
    if (!checkoutBtn) return;

    const buyerNameInput = document.getElementById('bagBuyerName');
    const portSelect = document.getElementById('bagDestinationPort');

    const buyerName = (buyerNameInput && buyerNameInput.value.trim()) || 'Export Buyer';
    const port = (portSelect && portSelect.value) || 'Port of Jebel Ali (UAE)';
    const total = getTotalTonnage();

    if (bagItems.length === 0) {
      checkoutBtn.href = `https://wa.me/919056003331?text=${encodeURIComponent('Hello HBX Foods Export Desk, I would like to inquire about a 20-Ton FCL Container Dispatch.')}`;
      return;
    }

    const itemLines = bagItems.map(i => `• ${i.title}: ${i.tons} Metric Tons (${i.packaging || 'Standard Packing'})`).join('\n');

    const rawMessage = `Hello HBX Foods Export Desk,\n\nI have configured a 20-Ton Container Mix on your website:\n${itemLines}\n---------------------------------\nTotal Volume: ${total.toFixed(1)} Metric Tons (${statusMode || '20T Load'})\nBuyer / Company: ${buyerName}\nDestination Seaport: ${port}\n\nPlease provide official CIF / FOB proforma quotation and container dispatch schedule.`;

    checkoutBtn.href = `https://wa.me/919056003331?text=${encodeURIComponent(rawMessage)}`;
  }

  function injectDrawerMarkup() {
    if (document.getElementById('containerBagDrawer')) return;

    // Overlay
    const overlay = document.createElement('div');
    overlay.id = 'containerBagOverlay';
    overlay.className = 'container-bag-overlay';
    overlay.onclick = closeContainerBag;
    document.body.appendChild(overlay);

    // Drawer
    const drawer = document.createElement('div');
    drawer.id = 'containerBagDrawer';
    drawer.className = 'container-bag-drawer';
    drawer.innerHTML = `
      <!-- Header -->
      <div class="bag-header">
        <div class="bag-header-left">
          <div class="bag-header-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
          </div>
          <div>
            <div class="bag-header-title">Export Container Bag</div>
            <div class="bag-header-sub">20-Ton FCL Mix Builder</div>
          </div>
        </div>
        <button type="button" class="bag-close-btn" onclick="HBXContainerBag.close()" aria-label="Close Container Bag">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      <!-- Top Container Visualizer -->
      <div class="bag-visualizer">
        <div class="bag-visualizer-stats">
          <div class="bag-tonnage-readout">
            <span id="bagTotalReadout">0.0</span>
            <span class="readout-max">/ 20.0 Tons</span>
          </div>
          <div class="bag-pct-readout" id="bagPctReadout">0% FCL Loaded</div>
        </div>

        <div class="bag-progress-track">
          <div class="bag-progress-fill" id="bagProgressFill" style="width: 0%;"></div>
        </div>

        <div class="bag-status-banner status-lcl" id="bagStatusBanner">
          <div class="status-icon">📦</div>
          <div class="status-text">
            <strong>LCL Mode</strong>
            <span>Add products to reach 20-Metric Ton container load.</span>
          </div>
        </div>
      </div>

      <!-- Scrollable Added Products List -->
      <div class="bag-items-scroll" id="bagItemsList"></div>

      <!-- Port & WhatsApp Checkout Section -->
      <div class="bag-footer">
        <div class="bag-form-group">
          <label class="bag-label" for="bagBuyerName">Company / Buyer Name</label>
          <input type="text" id="bagBuyerName" class="bag-input" placeholder="e.g. Al-Madina Foodstuffs LLC" oninput="HBXContainerBag.onFormChange()" />
        </div>

        <div class="bag-form-group">
          <label class="bag-label" for="bagDestinationPort">Destination Seaport</label>
          <select id="bagDestinationPort" class="bag-select" onchange="HBXContainerBag.onFormChange()">
            <option value="Jebel Ali Port (Dubai, UAE)">Port of Jebel Ali (Dubai, UAE)</option>
            <option value="Port of Rotterdam (Netherlands / EU Hub)">Port of Rotterdam (Netherlands / EU)</option>
            <option value="Port of New York & Newark (USA)">Port of New York & Newark (USA)</option>
            <option value="Port of Felixstowe (United Kingdom)">Port of Felixstowe (UK)</option>
            <option value="Port of Hamburg (Germany)">Port of Hamburg (Germany)</option>
            <option value="Port of Santos (Brazil / South America)">Port of Santos (Brazil)</option>
            <option value="Port of Singapore (Asia Hub)">Port of Singapore (Asia)</option>
            <option value="Port of Jeddah (Saudi Arabia)">Port of Jeddah (Saudi Arabia)</option>
            <option value="Other / Custom Seaport Destination">Other / Custom Seaport</option>
          </select>
        </div>

        <a id="bagCheckoutBtn" href="#" target="_blank" class="bag-checkout-btn">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.312.045-.694.074-2.146-.527-1.724-.717-2.827-2.483-2.912-2.599-.086-.115-.699-.933-.699-1.778 0-.846.438-1.261.594-1.433.155-.171.341-.215.454-.215.114 0 .228.001.328.006.105.006.246-.04.385.293.144.348.491 1.2.534 1.288.043.088.072.19.014.305-.058.115-.087.187-.173.289l-.261.306c-.086.086-.176.18-.076.353.1.173.445.735.955 1.19 1.02.91 1.88.995 2.147 1.082.173.058.275.051.378-.067.103-.118.441-.515.559-.692.118-.178.236-.148.397-.089.16.059 1.018.48 1.192.567.174.088.291.132.334.205.044.074.044.428-.1 1.033z"/>
          </svg>
          <span>Send Container Breakdown to WhatsApp</span>
        </a>
      </div>
    `;
    document.body.appendChild(drawer);
  }

  // Automatic decoration of Product Cards on catalog pages
  function autoDecorateProductCards() {
    const cards = document.querySelectorAll('.clean-p-card');
    cards.forEach(card => {
      if (card.querySelector('.btn-add-container')) return;
      const body = card.querySelector('.c-body');
      if (!body) return;

      const titleEl = body.querySelector('h3');
      const imgEl = card.querySelector('.c-img-wrap img');
      const title = titleEl ? titleEl.textContent.trim() : 'Export Spice';
      const img = imgEl ? imgEl.getAttribute('src') : 'images/hbx-official-emblem.png';
      
      const onclickAttr = card.getAttribute('onclick') || '';
      const match = onclickAttr.match(/openModal\(['"]([^'"]+)['"]\)/);
      const id = match ? match[1] : title.toLowerCase().replace(/[^a-z0-9]+/g, '-');

      const btnGroup = document.createElement('div');
      btnGroup.style.display = 'flex';
      btnGroup.style.alignItems = 'center';
      btnGroup.style.gap = '8px';

      const addBtn = document.createElement('button');
      addBtn.type = 'button';
      addBtn.className = 'btn-add-container';
      addBtn.title = 'Add 1 Ton to Container Bag';
      addBtn.innerHTML = `
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
        <span>+ Bag (1T)</span>
      `;
      addBtn.onclick = function (e) {
        e.stopPropagation();
        addToContainerBag({
          id: id,
          title: title,
          packaging: 'Standard Export Packaging',
          img: img,
          tons: 1.0
        });
      };

      const cBtn = body.querySelector('.c-btn');
      if (cBtn) {
        cBtn.parentNode.insertBefore(btnGroup, cBtn);
        btnGroup.appendChild(addBtn);
        btnGroup.appendChild(cBtn);
      } else {
        body.appendChild(addBtn);
      }
    });
  }

  // Automatic decoration of Product Detail Modal
  function autoDecorateModal() {
    const modalActions = document.querySelector('.modal-actions');
    if (!modalActions || modalActions.querySelector('#modalAddContainerBtn')) return;

    modalActions.style.display = 'flex';
    modalActions.style.flexDirection = 'column';
    modalActions.style.gap = '8px';

    const modalAddBtn = document.createElement('button');
    modalAddBtn.type = 'button';
    modalAddBtn.id = 'modalAddContainerBtn';
    modalAddBtn.className = 'btn-add-container';
    modalAddBtn.style.cssText = 'padding: 12px 18px; justify-content: center; font-size: 13px; width: 100%;';
    modalAddBtn.innerHTML = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
        <line x1="3" y1="6" x2="21" y2="6"></line>
        <path d="M16 10a4 4 0 0 1-8 0"></path>
      </svg>
      <span>+ Add to Container Bag (1 Ton)</span>
    `;

    modalAddBtn.onclick = function () {
      const title = document.getElementById('modalTitle') ? document.getElementById('modalTitle').innerText : 'Export Product';
      const img = document.getElementById('modalImg') ? document.getElementById('modalImg').getAttribute('src') : 'images/hbx-official-emblem.png';
      const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      
      addToContainerBag({
        id: id,
        title: title,
        packaging: 'Export Standard Packing',
        img: img,
        tons: 1.0
      });

      if (typeof closeModalDirect === 'function') {
        closeModalDirect();
      }
      openContainerBag();
    };

    modalActions.insertBefore(modalAddBtn, modalActions.firstChild);
  }

  // Escape key closes drawer
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      closeContainerBag();
    }
  });

  // Cross-tab synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY) {
      loadBag();
      renderBagDrawer();
    }
  });

  // Auto initialize on DOMContentLoaded
  function init() {
    loadBag();
    injectDrawerMarkup();
    renderBagDrawer();
    updateNavBadges();
    autoDecorateProductCards();
    autoDecorateModal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Global public API
  window.HBXContainerBag = {
    open: openContainerBag,
    close: closeContainerBag,
    toggle: toggleContainerBag,
    add: addToContainerBag,
    updateTonnage: updateItemTonnage,
    removeItem: removeItemFromBag,
    onFormChange: renderBagDrawer,
    getTotal: getTotalTonnage
  };

})();
