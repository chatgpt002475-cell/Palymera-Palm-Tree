// Main Application Controller for Palmyra Palm Tree
// Digital Operating System Architecture inspired by Captain Fresh (captainfresh.com/technology)

(function () {
  "use strict";

  // State Management
  const state = {
    cart: JSON.parse(localStorage.getItem("palmyra_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("palmyra_wishlist") || "[]"),
    activeCategory: "all",
    searchQuery: "",
    appliedDiscount: null,
    freeShippingThreshold: 499,
    activeOSTab: "layer1",
    activeBatchId: "BATCH-PLM-2026-X89"
  };

  // Mock Digital Operating System Layers Data (Captain Fresh Style)
  const OS_LAYERS_DATA = {
    layer1: {
      layerCode: "LAYER 01 // HARVEST GRID",
      title: "Wild Grove IoT & Harvester Telemetry",
      description: "Directly networking 1,200+ indigenous tapper families across Tamil Nadu's arid wild-growing palm forests. Every harvested wild palm is geofenced and tagged with RFID near-field chips.",
      features: [
        { title: "Dawn Sap Time-Stamping", desc: "Tapping logged at exactly 05:00 AM – 06:45 AM before sunlight triggers fermentation." },
        { title: "Smart RFID Clay Pot Sensor", desc: "Monitors internal pot temperature and micro-alkalinity in real-time." },
        { title: "Fair-Trade Instant Escrow", desc: "Climber compensation deposited directly to rural mobile accounts upon weigh-in." },
        { title: "Biodiversity Geofencing", desc: "Preserves 45,000+ wild mature palms without artificial irrigation or soil disruption." }
      ]
    },
    layer2: {
      layerCode: "LAYER 02 // LOGISTICS ENGINE",
      title: "Thermal Cold-Chain & Nectar Preservation",
      description: "Virgin palm sap (Padaneer) ferments rapidly within 3 hours under tropical heat. Our insulated, solar-chilled logistics grid arrests enzyme breakdown without chemical preservatives or lime oversaturation.",
      features: [
        { title: "Solar Cold-Vat Transit", desc: "Maintains raw sap at a steady 4°C during forest-to-hub transit." },
        { title: "Zero-Lime Preservation", desc: "Proprietary physical chilling eliminates the need for harsh calcium hydroxide clarification." },
        { title: "Route Optimization Engine", desc: "Automated routing algorithms collect sap within 90 minutes of collection." },
        { title: "Continuous pH Telemetry", desc: "Automated alerts flag any sap with pH dropping below 7.0 for alternative use." }
      ]
    },
    layer3: {
      layerCode: "LAYER 03 // PROCESSING STACK",
      title: "Automated Precision Low-Temp Crystallization",
      description: "State-of-the-art closed-loop steam evaporation replaces open woodfire scorching. Controlled temperature profiles prevent burnt off-flavors, preserves vital polyphenols, and seeds free-flowing micro-granules.",
      features: [
        { title: "Microprocessor Temp Curve", desc: "Steam heating gently held below 104°C to protect delicate Vitamin B12 and minerals." },
        { title: "Acoustic Crystal Seeding", desc: "Induces uniform natural crystallization without cornstarch or anticaking agents." },
        { title: "Zero Hydros Bleaching", desc: "Hermetically sealed environment guarantees zero sulfur dioxide contamination." },
        { title: "Moisture-Lock Dehumidification", desc: "Standardizes moisture below 3.0% for 24-month natural pantry shelf life." }
      ]
    },
    layer4: {
      layerCode: "LAYER 04 // TRUST INFRASTRUCTURE",
      title: "NABL Spectral QC & Source-to-Shelf Provenance",
      description: "Every commercial lot is analyzed via High-Performance Liquid Chromatography (HPLC) and assigned an immutable cryptographic batch certificate, accessible via the on-pack QR code.",
      features: [
        { title: "HPLC Adulteration Screen", desc: "Verifies zero presence of cane sugar syrup, invert sugar, or corn starch." },
        { title: "Clinical Low-GI Certification", desc: "In vitro starch digestibility assays confirm low glycemic response (GI < 40)." },
        { title: "ICP-MS Heavy Metal Test", desc: "Confirms non-detectable levels of lead, arsenic, mercury, and cadmium." },
        { title: "Consumer QR Verification", desc: "Consumers scan pack to view harvester profile, grove coordinates, and lab report." }
      ]
    }
  };

  // Mock Trace It to Trust It Batches Data (Captain Fresh Style)
  const TRACE_BATCHES_DATA = {
    "BATCH-PLM-2026-X89": {
      product: "Pure Crystallized Palm Jaggery (Karupatti)",
      groveLocation: "Tuticorin Wild Reserve (8.7642° N, 78.1348° E)",
      harvester: "M. Shanmugam (Master Tapper, 28 Yrs)",
      harvestTime: "05:42 AM IST",
      rawSapPH: "7.24 (Virgin Alkaline)",
      nablReportNo: "NABL-CH-2026-89410",
      testedGI: "35.2 (Clinically Low GI)",
      purityScore: "99.85%",
      sulfurDioxide: "Below Detection (< 1.5 ppm)",
      ironContent: "11.4 mg / 100g",
      packDate: "03 Nov 2026"
    },
    "BATCH-PLM-2026-P44": {
      product: "Palm Sugar Crystals (Panakarkandu)",
      groveLocation: "Ramanathapuram Coastal Belt (9.3639° N, 78.8395° E)",
      harvester: "K. Alagappan (Generational Harvester)",
      harvestTime: "06:10 AM IST",
      rawSapPH: "7.19 (Pristine)",
      nablReportNo: "NABL-MD-2026-44109",
      testedGI: "34.8 (Clinically Low GI)",
      purityScore: "99.92%",
      sulfurDioxide: "Zero Bleach Detected",
      ironContent: "8.6 mg / 100g",
      packDate: "01 Nov 2026"
    },
    "BATCH-PLM-2026-M12": {
      product: "Organic Finger Millet Flakes (Ragi Aval)",
      groveLocation: "Erode Regenerative Drylands (11.3410° N, 77.7172° E)",
      harvester: "R. Dhanalakshmi (Organic Farmer Co-op)",
      harvestTime: "07:30 AM IST",
      rawSapPH: "N/A (Dryland Grain)",
      nablReportNo: "NABL-ER-2026-12004",
      testedGI: "51.4 (Low-Medium GI)",
      purityScore: "100% Whole Grain",
      sulfurDioxide: "Chemical-Free",
      ironContent: "3.9 mg / 100g (344mg Calcium)",
      packDate: "28 Oct 2026"
    }
  };

  // DOM Elements
  const elements = {
    productsGrid: document.getElementById("products-grid"),
    catalogTabs: document.getElementById("catalog-tabs"),
    cartDrawer: document.getElementById("cart-drawer"),
    cartOverlay: document.getElementById("cart-drawer-overlay"),
    cartItemsContainer: document.getElementById("cart-items-container"),
    cartEmptyState: document.getElementById("cart-empty-state"),
    cartSubtotal: document.getElementById("cart-subtotal"),
    cartDiscountRow: document.getElementById("cart-discount-row"),
    cartDiscountAmount: document.getElementById("cart-discount-amount"),
    cartShipping: document.getElementById("cart-shipping"),
    cartTotal: document.getElementById("cart-total"),
    cartCountBadge: document.getElementById("cart-count-badge"),
    wishlistCountBadge: document.getElementById("wishlist-count-badge"),
    shippingFill: document.getElementById("shipping-fill"),
    shippingNotice: document.getElementById("shipping-notice"),
    couponInput: document.getElementById("coupon-input"),
    couponBtn: document.getElementById("apply-coupon-btn"),
    quickViewModal: document.getElementById("quick-view-modal"),
    recipeModal: document.getElementById("recipe-modal"),
    checkoutModal: document.getElementById("checkout-modal"),
    b2bModal: document.getElementById("b2b-modal"),
    toastContainer: document.getElementById("toast-container"),
    // Captain Fresh components
    osTabPanel: document.getElementById("os-tab-panel"),
    traceCertDisplay: document.getElementById("trace-cert-display"),
    liveTelemetryPH: document.getElementById("live-telemetry-ph"),
    liveTelemetryBatches: document.getElementById("live-telemetry-batches"),
    liveTelemetryPurity: document.getElementById("live-telemetry-purity")
  };

  // Toast System
  function showToast(message, type = "info") {
    if (!elements.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${message}</span>
    `;
    elements.toastContainer.appendChild(toast);
    setTimeout(() => {
      toast.style.opacity = "0";
      toast.style.transform = "translateY(10px)";
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // Save Cart & Wishlist to LocalStorage
  function saveCart() {
    localStorage.setItem("palmyra_cart", JSON.stringify(state.cart));
    updateCartUI();
  }

  function saveWishlist() {
    localStorage.setItem("palmyra_wishlist", JSON.stringify(state.wishlist));
    updateWishlistUI();
  }

  // Update Cart UI
  function updateCartUI() {
    const totalItems = state.cart.reduce((sum, item) => sum + item.qty, 0);
    if (elements.cartCountBadge) {
      elements.cartCountBadge.textContent = totalItems;
      elements.cartCountBadge.style.display = totalItems > 0 ? "flex" : "none";
    }

    if (!elements.cartItemsContainer) return;

    if (state.cart.length === 0) {
      elements.cartItemsContainer.innerHTML = "";
      if (elements.cartEmptyState) elements.cartEmptyState.style.display = "block";
      if (elements.cartSubtotal) elements.cartSubtotal.textContent = "₹0";
      if (elements.cartShipping) elements.cartShipping.textContent = "₹0";
      if (elements.cartTotal) elements.cartTotal.textContent = "₹0";
      if (elements.shippingFill) elements.shippingFill.style.width = "0%";
      if (elements.shippingNotice) {
        elements.shippingNotice.innerHTML = `Add <strong>₹${state.freeShippingThreshold}</strong> more for Free Pan-India Delivery!`;
      }
      return;
    }

    if (elements.cartEmptyState) elements.cartEmptyState.style.display = "none";

    let subtotal = 0;
    elements.cartItemsContainer.innerHTML = state.cart.map((item, index) => {
      const itemTotal = item.price * item.qty;
      subtotal += itemTotal;
      const svgImage = window.PRODUCT_SVG_IMAGES && window.PRODUCT_SVG_IMAGES[item.id] 
        ? window.PRODUCT_SVG_IMAGES[item.id] 
        : `<div style="background:#091712;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#00F5A0;">${item.name[0]}</div>`;

      return `
        <div class="cart-item">
          <div class="cart-item-img">${svgImage}</div>
          <div>
            <h4 style="font-size: 0.9rem; font-weight: 700; color: #FFF; margin-bottom: 2px;">${item.name}</h4>
            <div style="font-size: 0.75rem; color: #94A3B8; margin-bottom: 6px;">${item.weight} • ₹${item.price} each</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="window.PalmyraApp.updateCartQty(${index}, -1)">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="window.PalmyraApp.updateCartQty(${index}, 1)">+</button>
            </div>
          </div>
          <div>
            <div style="font-weight: 800; font-size: 0.95rem; color: #00F5A0; text-align: right; font-family: var(--font-mono);">₹${itemTotal}</div>
            <button class="cart-item-remove" onclick="window.PalmyraApp.removeCartItem(${index})">Remove</button>
          </div>
        </div>
      `;
    }).join("");

    // Calculate Discounts & Shipping
    let discountAmount = 0;
    if (state.appliedDiscount) {
      discountAmount = Math.round((subtotal * state.appliedDiscount.percent) / 100);
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = "flex";
      if (elements.cartDiscountAmount) elements.cartDiscountAmount.textContent = `-₹${discountAmount}`;
    } else {
      if (elements.cartDiscountRow) elements.cartDiscountRow.style.display = "none";
    }

    const shippingCost = subtotal >= state.freeShippingThreshold ? 0 : 50;
    const finalTotal = Math.max(0, subtotal - discountAmount + shippingCost);

    if (elements.cartSubtotal) elements.cartSubtotal.textContent = `₹${subtotal}`;
    if (elements.cartShipping) {
      elements.cartShipping.textContent = shippingCost === 0 ? "FREE" : `₹${shippingCost}`;
      elements.cartShipping.style.color = shippingCost === 0 ? "#00F5A0" : "inherit";
    }
    if (elements.cartTotal) elements.cartTotal.textContent = `₹${finalTotal}`;

    // Free shipping bar progress
    if (elements.shippingFill && elements.shippingNotice) {
      const progressPercent = Math.min(100, Math.round((subtotal / state.freeShippingThreshold) * 100));
      elements.shippingFill.style.width = `${progressPercent}%`;
      if (subtotal >= state.freeShippingThreshold) {
        elements.shippingNotice.innerHTML = `🎉 <strong>Congratulations!</strong> You qualify for <strong>FREE Pan-India Delivery!</strong>`;
      } else {
        const remaining = state.freeShippingThreshold - subtotal;
        elements.shippingNotice.innerHTML = `Add <strong>₹${remaining}</strong> more for <strong>FREE Pan-India Delivery!</strong>`;
      }
    }
  }

  // Update Wishlist Badge
  function updateWishlistUI() {
    if (elements.wishlistCountBadge) {
      elements.wishlistCountBadge.textContent = state.wishlist.length;
      elements.wishlistCountBadge.style.display = state.wishlist.length > 0 ? "flex" : "none";
    }
  }

  // Cart Operations
  function addToCart(productId, weightIndex = 0, quantity = 1) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product) return;

    const selectedWeight = product.weightOptions[weightIndex];
    const existingIndex = state.cart.findIndex(
      item => item.id === productId && item.weight === selectedWeight.weight
    );

    if (existingIndex > -1) {
      state.cart[existingIndex].qty += quantity;
    } else {
      state.cart.push({
        id: product.id,
        name: product.name,
        price: selectedWeight.price,
        originalPrice: selectedWeight.originalPrice,
        weight: selectedWeight.weight,
        qty: quantity
      });
    }

    saveCart();
    showToast(`Added ${product.name} (${selectedWeight.weight}) to cart!`, "success");
    openCart();
  }

  function updateCartQty(index, change) {
    if (!state.cart[index]) return;
    state.cart[index].qty += change;
    if (state.cart[index].qty <= 0) {
      state.cart.splice(index, 1);
      showToast("Item removed from cart");
    }
    saveCart();
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const removed = state.cart.splice(index, 1)[0];
    saveCart();
    showToast(`Removed ${removed.name} from cart`);
  }

  function openCart() {
    if (elements.cartDrawer) elements.cartDrawer.classList.add("open");
    if (elements.cartOverlay) elements.cartOverlay.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    if (elements.cartDrawer) elements.cartDrawer.classList.remove("open");
    if (elements.cartOverlay) elements.cartOverlay.classList.remove("open");
    document.body.style.overflow = "";
  }

  function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast("Removed from saved items");
    } else {
      state.wishlist.push(productId);
      showToast("Batch saved to wishlist!", "success");
    }
    saveWishlist();
    renderProducts();
  }

  function applyCoupon() {
    if (!elements.couponInput) return;
    const code = elements.couponInput.value.trim().toUpperCase();
    if (!code) return;

    if (code === "PALMPURE10") {
      state.appliedDiscount = { code: "PALMPURE10", percent: 10 };
      showToast("Promo Code Applied! 10% Off your order 🎉", "success");
    } else if (code === "CAPTAIN15" || code === "WELLBEING15") {
      state.appliedDiscount = { code: code, percent: 15 };
      showToast("Tech Partner Code Applied! 15% Off 🎉", "success");
    } else {
      showToast("Invalid promo code. Try PALMPURE10 or CAPTAIN15", "error");
      return;
    }
    updateCartUI();
  }

  // ==========================================================================
  // Captain Fresh Interactive Operating System Architecture Tabs
  // ==========================================================================
  function switchOSTab(layerKey) {
    state.activeOSTab = layerKey;
    const data = OS_LAYERS_DATA[layerKey];
    if (!data || !elements.osTabPanel) return;

    // Update active class on tab buttons
    document.querySelectorAll(".os-tab-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.layer === layerKey);
    });

    elements.osTabPanel.innerHTML = `
      <div>
        <div class="panel-header-badge">
          <span class="pulse-dot"></span>
          <span>${data.layerCode}</span>
        </div>
        <h3 class="panel-title">${data.title}</h3>
        <p class="panel-description">${data.description}</p>

        <div class="panel-features-grid">
          ${data.features.map(f => `
            <div class="panel-feature-item">
              <h5>${f.title}</h5>
              <p>${f.desc}</p>
            </div>
          `).join("")}
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--border-subtle); padding-top:20px;">
        <span style="font-size:0.78rem; font-family:var(--font-mono); color:var(--text-muted);">
          STATUS: <strong style="color:var(--neon-green);">LIVE TELEMETRY STREAMING</strong>
        </span>
        <button class="btn-outline" style="padding:8px 18px; font-size:0.82rem;" onclick="window.PalmyraApp.openB2BModal()">
          Request Technical Whitepaper ↗
        </button>
      </div>
    `;
  }

  // ==========================================================================
  // Captain Fresh "Trace It to Trust It" Batch Provenance Simulator
  // ==========================================================================
  function switchTraceBatch(batchId) {
    state.activeBatchId = batchId;
    const cert = TRACE_BATCHES_DATA[batchId];
    if (!cert || !elements.traceCertDisplay) return;

    // Update active state in buttons
    document.querySelectorAll(".batch-selector-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.batch === batchId);
    });

    elements.traceCertDisplay.innerHTML = `
      <div class="cert-header">
        <div>
          <span style="font-size:0.68rem; color:var(--neon-green); letter-spacing:0.1em;">DIGITAL BATCH CERTIFICATE</span>
          <h4 style="font-size:1.15rem; color:#FFF; margin:2px 0;">${cert.product}</h4>
          <span style="font-size:0.75rem; color:var(--text-muted);">REF: ${batchId}</span>
        </div>
        <div style="background:rgba(0, 245, 160, 0.12); border:1px solid var(--neon-green); color:var(--neon-green); font-size:0.72rem; padding:4px 10px; border-radius:4px; font-weight:700;">
          VERIFIED NABL PASS
        </div>
      </div>

      <div class="cert-meta-row">
        <div class="cert-meta-box">
          <div class="cert-meta-label">Wild Grove Coordinates</div>
          <div class="cert-meta-val" style="color:var(--neon-green); font-size:0.76rem;">${cert.groveLocation}</div>
        </div>
        <div class="cert-meta-box">
          <div class="cert-meta-label">Harvester Artisan</div>
          <div class="cert-meta-val">${cert.harvester}</div>
        </div>
        <div class="cert-meta-box">
          <div class="cert-meta-label">Dawn Harvest Time & pH</div>
          <div class="cert-meta-val">${cert.harvestTime} | ${cert.rawSapPH}</div>
        </div>
        <div class="cert-meta-box">
          <div class="cert-meta-label">Clinical Glycemic Index</div>
          <div class="cert-meta-val" style="color:#00F5A0; font-size:1.05rem;">GI ${cert.testedGI}</div>
        </div>
      </div>

      <div style="background:rgba(255,255,255,0.02); border:1px solid var(--border-subtle); border-radius:8px; padding:12px; margin-bottom:14px; font-size:0.75rem;">
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="color:var(--text-muted);">HPLC Sugar Spectrum:</span>
          <strong style="color:var(--neon-green);">Zero Invert Syrup / Cane Adulteration</strong>
        </div>
        <div style="display:flex; justify-content:space-between; margin-bottom:4px;">
          <span style="color:var(--text-muted);">Sulfur Dioxide (SO2):</span>
          <strong>${cert.sulfurDioxide}</strong>
        </div>
        <div style="display:flex; justify-content:space-between;">
          <span style="color:var(--text-muted);">Natural Bioavailable Iron:</span>
          <strong style="color:#FBBF24;">${cert.ironContent}</strong>
        </div>
      </div>

      <div style="display:flex; justify-content:space-between; align-items:center;">
        <span style="font-size:0.7rem; color:var(--text-muted);">PACKED ON: ${cert.packDate}</span>
        <button class="btn-primary" style="padding:6px 14px; font-size:0.78rem;" onclick="window.PalmyraApp.showToast('Full NABL PDF chromatogram downloaded!', 'success')">
          Download PDF COA
        </button>
      </div>
    `;
  }

  // Live Telemetry Simulation Loop (Captain Fresh Control Tower)
  function initLiveTelemetryLoop() {
    setInterval(() => {
      if (elements.liveTelemetryPH) {
        const ph = (7.21 + Math.random() * 0.06).toFixed(2);
        elements.liveTelemetryPH.textContent = `${ph} pH`;
      }
      if (elements.liveTelemetryBatches) {
        const jitter = Math.floor(1240 + Math.random() * 5);
        elements.liveTelemetryBatches.textContent = jitter.toLocaleString();
      }
      if (elements.liveTelemetryPurity) {
        const purity = (99.82 + Math.random() * 0.08).toFixed(2);
        elements.liveTelemetryPurity.textContent = `${purity}%`;
      }
    }, 3500);
  }

  // Render Product Catalog
  function renderProducts() {
    if (!elements.productsGrid || !window.PRODUCTS_DATA) return;

    let filtered = window.PRODUCTS_DATA.filter(product => {
      const matchesCategory = state.activeCategory === "all" || product.category === state.activeCategory;
      const matchesSearch = !state.searchQuery || 
        product.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        product.tagline.toLowerCase().includes(state.searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      elements.productsGrid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px;">
          <p style="font-size: 1.1rem; color: #94A3B8;">No batches matching your filter criteria.</p>
          <button class="btn-outline" style="margin-top: 14px;" onclick="window.PalmyraApp.setCategory('all')">View All Batches</button>
        </div>
      `;
      return;
    }

    elements.productsGrid.innerHTML = filtered.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      const svgIllustration = window.PRODUCT_SVG_IMAGES && window.PRODUCT_SVG_IMAGES[product.id] 
        ? window.PRODUCT_SVG_IMAGES[product.id] 
        : `<div style="background:#091712;height:100%;width:100%;display:flex;align-items:center;justify-content:center;color:#00F5A0;font-size:2rem;font-weight:bold;">${product.name[0]}</div>`;

      const defaultWeight = product.weightOptions[0];

      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-badge">${product.badge}</div>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="window.PalmyraApp.toggleWishlist('${product.id}')" title="Save Batch">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </button>
          
          <div class="product-image-container" onclick="window.PalmyraApp.openQuickView('${product.id}')">
            ${svgIllustration}
          </div>

          <div class="product-info">
            <div class="product-category-tag">${product.category}</div>
            <h3 class="product-title" onclick="window.PalmyraApp.openQuickView('${product.id}')">${product.name}</h3>
            <div class="product-tamil-name">${product.tamilName}</div>
            
            <div class="product-rating-row">
              <span class="stars">★ ★ ★ ★ ★</span>
              <span style="font-weight:700; color:#FFF;">${product.rating}</span>
              <span style="color:#64748B;">(${product.reviewCount} batches)</span>
            </div>

            <p class="product-desc-snippet">${product.shortDescription}</p>

            <div class="product-price-row">
              <span class="current-price">₹${defaultWeight.price}</span>
              <span class="original-price">₹${defaultWeight.originalPrice}</span>
              <span class="discount-tag">Save ₹${defaultWeight.originalPrice - defaultWeight.price}</span>
            </div>

            <div class="card-actions">
              <button class="btn-card-add" onclick="window.PalmyraApp.addToCart('${product.id}', 0, 1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                </svg>
                Add to Cart
              </button>
              <button class="btn-card-view" onclick="window.PalmyraApp.openQuickView('${product.id}')">
                Telemetry
              </button>
            </div>
          </div>
        </div>
      `;
    }).join("");
  }

  // Quick View Modal
  function openQuickView(productId) {
    const product = window.PRODUCTS_DATA.find(p => p.id === productId);
    if (!product || !elements.quickViewModal) return;

    let selectedWeightIndex = 0;
    const svgIllustration = window.PRODUCT_SVG_IMAGES && window.PRODUCT_SVG_IMAGES[product.id] 
      ? window.PRODUCT_SVG_IMAGES[product.id] 
      : "";

    function renderModalContent() {
      const currentOption = product.weightOptions[selectedWeightIndex];
      elements.quickViewModal.innerHTML = `
        <div class="modal-container" style="padding: 36px; max-width: 860px;">
          <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('quick-view-modal')">✕</button>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 32px; align-items: start;">
            <div style="background: #06110D; border-radius: 16px; padding: 20px; display:flex; align-items:center; justify-content:center; border: 1px solid var(--border-subtle);">
              ${svgIllustration}
            </div>

            <div>
              <div class="hero-pill" style="margin-bottom: 8px;">${product.badge}</div>
              <h2 style="font-size: 1.8rem; margin-bottom: 4px; color:#FFF;">${product.name}</h2>
              <div style="font-style: italic; color: #94A3B8; margin-bottom: 12px; font-size: 0.9rem;">${product.tamilName}</div>
              
              <div class="product-price-row" style="margin-bottom: 16px;">
                <span class="current-price" style="font-size: 1.8rem; color:#00F5A0;">₹${currentOption.price}</span>
                <span class="original-price" style="font-size: 1.1rem;">₹${currentOption.originalPrice}</span>
                <span class="discount-tag">Save ₹${currentOption.originalPrice - currentOption.price}</span>
              </div>

              <p style="color: #CBD5E1; font-size: 0.92rem; line-height: 1.6; margin-bottom: 20px;">
                ${product.fullDescription}
              </p>

              <!-- Pack Size Selector -->
              <div style="margin-bottom: 20px;">
                <label style="display:block; font-size: 0.8rem; font-weight: 700; color: #FFF; margin-bottom: 8px; font-family:var(--font-tech);">SELECT CERTIFIED LOT SIZE:</label>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  ${product.weightOptions.map((opt, i) => `
                    <button type="button" class="tab-btn ${i === selectedWeightIndex ? 'active' : ''}" style="padding: 8px 16px; font-size: 0.82rem;" onclick="window.PalmyraApp.switchQuickWeight(${i})">
                      ${opt.weight} (₹${opt.price})
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- Lab Highlights -->
              <div style="background: rgba(255,255,255,0.03); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin-bottom: 22px;">
                <h4 style="font-size: 0.82rem; margin-bottom: 8px; color: var(--neon-green); font-family:var(--font-tech);">NABL CERTIFIED SPECS:</h4>
                <ul style="padding-left: 20px; font-size: 0.82rem; color: #94A3B8; line-height: 1.6;">
                  ${product.features.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>

              <button class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; justify-content: center;" onclick="window.PalmyraApp.addToCart('${product.id}', ${selectedWeightIndex}, 1); window.PalmyraApp.closeModal('quick-view-modal');">
                Add to Cart (₹${currentOption.price})
              </button>
            </div>
          </div>
        </div>
      `;
    }

    window.PalmyraApp.switchQuickWeight = function (index) {
      selectedWeightIndex = index;
      renderModalContent();
    };

    renderModalContent();
    elements.quickViewModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // Render Recipes Showcase
  function renderRecipes() {
    const container = document.getElementById("recipes-grid");
    if (!container || !window.RECIPES_DATA) return;

    container.innerHTML = window.RECIPES_DATA.map(recipe => `
      <div style="background:var(--bg-card); border:1px solid var(--border-subtle); border-radius:var(--radius-lg); padding:28px; display:flex; flex-direction:column; backdrop-filter:blur(16px);">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:12px; font-size:0.75rem; color:var(--neon-green); font-family:var(--font-mono);">
          <span>⏱ ${recipe.time}</span>
          <span>•</span>
          <span>🍽 ${recipe.serving}</span>
        </div>
        <h3 style="font-size:1.25rem; color:#FFF; margin-bottom:10px;">${recipe.title}</h3>
        <p style="font-size:0.86rem; color:var(--text-secondary); line-height:1.6; margin-bottom:20px; flex-grow:1;">${recipe.description}</p>
        <button class="btn-outline" style="width:100%; justify-content:center;" onclick="window.PalmyraApp.openRecipeModal('${recipe.id}')">
          View Recipe Steps ↗
        </button>
      </div>
    `).join("");
  }

  function openRecipeModal(recipeId) {
    const recipe = window.RECIPES_DATA.find(r => r.id === recipeId);
    if (!recipe || !elements.recipeModal) return;

    elements.recipeModal.innerHTML = `
      <div class="modal-container" style="padding: 36px; max-width: 720px;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('recipe-modal')">✕</button>
        <span class="hero-pill" style="margin-bottom: 8px;">${recipe.category.toUpperCase()} • ${recipe.time}</span>
        <h2 style="font-size: 2rem; margin-bottom: 8px; color:#FFF;">${recipe.title}</h2>
        <p style="color: var(--text-secondary); font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">${recipe.description}</p>

        <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 24px; margin-bottom: 24px;">
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--neon-green); font-family:var(--font-tech);">Ingredients (${recipe.serving}):</h4>
            <ul style="padding-left: 18px; font-size: 0.85rem; color: #CBD5E1; line-height: 1.7;">
              ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4 style="font-size: 0.95rem; margin-bottom: 12px; color: var(--neon-green); font-family:var(--font-tech);">Method & Steps:</h4>
            <ol style="padding-left: 18px; font-size: 0.85rem; color: #CBD5E1; line-height: 1.7;">
              ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(0,245,160,0.06); padding: 14px 20px; border-radius: 12px; border: 1px solid rgba(0,245,160,0.2);">
          <div>
            <div style="font-size: 0.72rem; color: var(--text-muted);">Key Low-GI Ingredient:</div>
            <strong style="color: #FFF;">${recipe.heroProductName}</strong>
          </div>
          <button class="btn-primary" onclick="window.PalmyraApp.addToCart('${recipe.heroProduct}', 0, 1); window.PalmyraApp.closeModal('recipe-modal');">
            Add to Cart
          </button>
        </div>
      </div>
    `;

    elements.recipeModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  // Render Glycemic Index Benchmark Bars
  function renderBenchmarkGI() {
    const container = document.getElementById("gi-bars-container");
    if (!container || !window.BENCHMARK_DATA) return;

    container.innerHTML = window.BENCHMARK_DATA.glycemicIndex.map(item => `
      <div class="gi-bar-item">
        <div class="gi-bar-label">
          ${item.highlight ? '⚡ ' : ''}<strong>${item.name}</strong>
        </div>
        <div class="gi-bar-track">
          <div class="gi-bar-fill" style="width: ${Math.min(100, item.gi)}%; background: ${item.color};">
            ${item.category}
          </div>
        </div>
        <div class="gi-bar-val" style="color: ${item.color};">GI ${item.gi}</div>
      </div>
    `).join("");
  }

  // Render Comparison Table
  function renderComparisonTable() {
    const tbody = document.getElementById("benchmark-table-body");
    if (!tbody || !window.BENCHMARK_DATA) return;

    tbody.innerHTML = window.BENCHMARK_DATA.comparisonTable.map(row => `
      <tr>
        <td><strong style="color:#FFF;">${row.parameter}</strong></td>
        <td class="highlight">${row.palmyraPalm}</td>
        <td>${row.whiteSugar}</td>
        <td>${row.brownSugar}</td>
        <td>${row.commercialHoney}</td>
        <td style="font-size: 0.8rem; color: #00F5A0;">${row.verdict}</td>
      </tr>
    `).join("");
  }

  // Checkout Flow
  function openCheckout() {
    if (state.cart.length === 0) {
      showToast("Your cart is empty!", "error");
      return;
    }
    closeCart();

    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const discount = state.appliedDiscount ? Math.round((subtotal * state.appliedDiscount.percent) / 100) : 0;
    const shipping = subtotal >= state.freeShippingThreshold ? 0 : 50;
    const finalTotal = subtotal - discount + shipping;

    elements.checkoutModal.innerHTML = `
      <div class="modal-container" style="padding: 36px; max-width: 680px;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('checkout-modal')">✕</button>
        <div class="hero-pill" style="margin-bottom:8px;">INSTANT DISPATCH</div>
        <h2 style="font-size: 1.8rem; margin-bottom: 6px; color:#FFF;">Express Enterprise & Retail Checkout</h2>
        <p style="color: var(--text-secondary); font-size: 0.88rem; margin-bottom: 24px;">Direct harvest dispatch from accredited processing hubs.</p>

        <form id="checkout-form" onsubmit="window.PalmyraApp.processCheckout(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">FULL NAME *</label>
              <input type="text" required placeholder="Arjun Subramanian" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">PHONE NUMBER *</label>
              <input type="tel" required placeholder="+91 98765 43210" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">EMAIL ADDRESS *</label>
            <input type="email" required placeholder="arjun@example.com" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">DELIVERY ADDRESS *</label>
            <textarea required rows="2" placeholder="Suite / House #, Landmark, Street" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">CITY / STATE *</label>
              <input type="text" required placeholder="Bengaluru, Karnataka" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">PINCODE *</label>
              <input type="text" required placeholder="560001" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
          </div>

          <div style="background: rgba(255,255,255,0.02); border: 1px solid var(--border-subtle); border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px; color:var(--text-secondary);">
              <span>Subtotal:</span>
              <strong style="color:#FFF;">₹${subtotal}</strong>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: #00F5A0; margin-bottom: 6px;">
                <span>Discount Applied:</span>
                <strong>-₹${discount}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 8px; color:var(--text-secondary);">
              <span>Delivery Speed:</span>
              <strong style="color: #00F5A0;">${shipping === 0 ? 'FREE EXPRESS' : '₹' + shipping}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.2rem; font-weight: 800; border-top: 1px dashed var(--border-subtle); padding-top: 8px; color: #FFF; font-family:var(--font-mono);">
              <span>Total Payable:</span>
              <span style="color:#00F5A0;">₹${finalTotal}</span>
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 16px; font-size: 1.05rem; justify-content: center;">
            Confirm Dispatch & Pay ₹${finalTotal}
          </button>
        </form>
      </div>
    `;

    elements.checkoutModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function processCheckout(event) {
    event.preventDefault();
    const orderId = "PLM-" + Math.floor(100000 + Math.random() * 900000);
    const subtotal = state.cart.reduce((sum, i) => sum + (i.price * i.qty), 0);
    const discount = state.appliedDiscount ? Math.round((subtotal * state.appliedDiscount.percent) / 100) : 0;
    const shipping = subtotal >= state.freeShippingThreshold ? 0 : 50;
    const finalTotal = subtotal - discount + shipping;

    elements.checkoutModal.innerHTML = `
      <div class="modal-container" style="padding: 40px; max-width: 600px; text-align: center;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('checkout-modal')">✕</button>
        <div style="width: 68px; height: 68px; background: rgba(0,245,160,0.15); border: 2px solid var(--neon-green); color: var(--neon-green); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px;">
          ✓
        </div>
        <h2 style="font-size: 1.9rem; margin-bottom: 8px; color: #FFF;">Order Dispatched!</h2>
        <p style="color: var(--text-secondary); margin-bottom: 24px;">Your certified batch is staged for cold-chain priority transit.</p>

        <div style="background: #040A08; border: 1px solid var(--border-subtle); border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px; font-family:var(--font-mono); font-size: 0.85rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Waybill Reference:</span>
            <strong style="color:var(--neon-green);">#${orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: var(--text-muted);">Total Settled:</span>
            <strong style="color: #FFF;">₹${finalTotal}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: var(--text-muted);">Quality Authentication:</span>
            <strong style="color: var(--neon-green);">NABL Batch Verified</strong>
          </div>
        </div>

        <button class="btn-primary" style="margin: 0 auto;" onclick="window.PalmyraApp.closeModal('checkout-modal'); window.print();">
          🖨 Print / Save Receipt
        </button>
      </div>
    `;

    state.cart = [];
    state.appliedDiscount = null;
    saveCart();
    showToast("Order confirmed! Digital receipt generated.", "success");
  }

  // B2B Wholesale Portal
  function openB2BModal() {
    elements.b2bModal.innerHTML = `
      <div class="modal-container" style="padding: 36px; max-width: 650px;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('b2b-modal')">✕</button>
        <span class="hero-pill" style="margin-bottom: 8px;">ENTERPRISE & EXPORT STACK</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 8px; color:#FFF;">B2B Bulk & White-Label Access</h2>
        <p style="color: var(--text-secondary); font-size: 0.88rem; line-height: 1.5; margin-bottom: 24px;">
          Supplying food service brands, specialty roasters, functional beverage producers, and international importers with standardized low-GI Palmyra ingredients.
        </p>

        <form onsubmit="window.PalmyraApp.submitB2BForm(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">ENTERPRISE NAME *</label>
              <input type="text" required placeholder="Nova Nutrition Labs" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">KEY CONTACT *</label>
              <input type="text" required placeholder="Kiran Roy" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">BUSINESS EMAIL *</label>
              <input type="email" required placeholder="procurement@brand.com" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
            <div>
              <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">PHONE / WHATSAPP *</label>
              <input type="tel" required placeholder="+91 99887 76655" style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.78rem; font-weight: 700; color:#FFF; margin-bottom: 6px;">INTERESTED PRODUCT SPECIFICATION *</label>
            <select required style="width:100%; padding: 10px 14px; background:#040A08; border:1px solid var(--border-subtle); border-radius: 8px; color:#FFF;">
              <option value="">Select ingredient requirement...</option>
              <option value="crystallized">Granulated Low-GI Palm Jaggery (100kg+ Monthly)</option>
              <option value="crystals">Panakarkandu Amber Crystals (50kg+ Monthly)</option>
              <option value="prebiotic">Palmyra Sprout Prebiotic Flour (Bulk Tonnes)</option>
              <option value="white_label">Complete Private-Label Consumer Packaging</option>
            </select>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; justify-content: center;">
            Request Commercial Quotation & COA
          </button>
        </form>
      </div>
    `;

    elements.b2bModal.classList.add("open");
    document.body.style.overflow = "hidden";
  }

  function submitB2BForm(event) {
    event.preventDefault();
    closeModal("b2b-modal");
    showToast("Commercial inquiry logged! Enterprise account manager assigned.", "success");
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  function setCategory(category) {
    state.activeCategory = category;
    if (elements.catalogTabs) {
      elements.catalogTabs.querySelectorAll(".tab-btn").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.category === category);
      });
    }
    renderProducts();
  }

  // Event Listeners Initialization
  function initEvents() {
    const cartOpenBtn = document.getElementById("cart-open-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");

    if (cartOpenBtn) cartOpenBtn.addEventListener("click", openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
    if (elements.cartOverlay) elements.cartOverlay.addEventListener("click", closeCart);

    if (elements.couponBtn) elements.couponBtn.addEventListener("click", applyCoupon);

    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

    if (elements.catalogTabs) {
      elements.catalogTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (btn) setCategory(btn.dataset.category);
      });
    }

    const searchInput = document.getElementById("nav-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim();
        renderProducts();
      });
    }

    [elements.quickViewModal, elements.recipeModal, elements.checkoutModal, elements.b2bModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal.id);
      });
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeModal("quick-view-modal");
        closeModal("recipe-modal");
        closeModal("checkout-modal");
        closeModal("b2b-modal");
      }
    });

    // Mobile nav
    const mobileMenuBtn = document.getElementById("mobile-menu-btn");
    const navLinks = document.querySelector(".nav-links");
    if (mobileMenuBtn && navLinks) {
      mobileMenuBtn.addEventListener("click", () => {
        navLinks.style.display = navLinks.style.display === "flex" ? "none" : "flex";
        navLinks.style.flexDirection = "column";
        navLinks.style.position = "absolute";
        navLinks.style.top = "100%";
        navLinks.style.left = "0";
        navLinks.style.right = "0";
        navLinks.style.background = "#081410";
        navLinks.style.padding = "20px";
        navLinks.style.borderBottom = "1px solid var(--border-subtle)";
      });
    }
  }

  // Application Startup
  function init() {
    renderProducts();
    renderBenchmarkGI();
    renderComparisonTable();
    renderRecipes();
    updateCartUI();
    updateWishlistUI();
    initEvents();
    initLiveTelemetryLoop();

    // Default OS layer and trace batch
    switchOSTab("layer1");
    switchTraceBatch("BATCH-PLM-2026-X89");

    if (window.initSugarCalculator) {
      window.initSugarCalculator();
    }
  }

  window.PalmyraApp = {
    addToCart,
    updateCartQty,
    removeCartItem,
    openCart,
    closeCart,
    toggleWishlist,
    openQuickView,
    openRecipeModal,
    openCheckout,
    processCheckout,
    openB2BModal,
    submitB2BForm,
    closeModal,
    setCategory,
    showToast,
    switchOSTab,
    switchTraceBatch
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
