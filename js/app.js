// Main Application Controller for Palmyra Palm Tree
// Integrates Catalog, Cart, Benchmark Matrix, Calculator, Recipes, and Modals

(function () {
  "use strict";

  // State Management
  const state = {
    cart: JSON.parse(localStorage.getItem("palmyra_cart") || "[]"),
    wishlist: JSON.parse(localStorage.getItem("palmyra_wishlist") || "[]"),
    activeCategory: "all",
    searchQuery: "",
    appliedDiscount: null, // e.g. { code: 'PALMPURE10', percent: 10 }
    freeShippingThreshold: 499
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
    toastContainer: document.getElementById("toast-container")
  };

  // Toast System
  function showToast(message, type = "info") {
    if (!elements.toastContainer) return;
    const toast = document.createElement("div");
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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
        : `<div style="background:#E2CFB4;width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-weight:bold;color:#78350F;">${item.name[0]}</div>`;

      return `
        <div class="cart-item">
          <div class="cart-item-img">${svgImage}</div>
          <div>
            <h4 class="cart-item-title">${item.name}</h4>
            <div class="cart-item-variant">${item.weight} • ₹${item.price} each</div>
            <div class="qty-control">
              <button class="qty-btn" onclick="window.PalmyraApp.updateCartQty(${index}, -1)">-</button>
              <span class="qty-num">${item.qty}</span>
              <button class="qty-btn" onclick="window.PalmyraApp.updateCartQty(${index}, 1)">+</button>
            </div>
          </div>
          <div>
            <div class="cart-item-price">₹${itemTotal}</div>
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
      elements.cartShipping.style.color = shippingCost === 0 ? "#16A34A" : "inherit";
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

  // Toggle Wishlist
  function toggleWishlist(productId) {
    const index = state.wishlist.indexOf(productId);
    if (index > -1) {
      state.wishlist.splice(index, 1);
      showToast("Removed from wishlist");
    } else {
      state.wishlist.push(productId);
      showToast("Saved to your wishlist!", "success");
    }
    saveWishlist();
    renderProducts();
  }

  // Coupon Application
  function applyCoupon() {
    if (!elements.couponInput) return;
    const code = elements.couponInput.value.trim().toUpperCase();
    if (!code) return;

    if (code === "PALMPURE10") {
      state.appliedDiscount = { code: "PALMPURE10", percent: 10 };
      showToast("Promo Code Applied! 10% Off your entire order 🎉", "success");
    } else if (code === "WELLBEING15") {
      state.appliedDiscount = { code: "WELLBEING15", percent: 15 };
      showToast("Wellbeing Special Code Applied! 15% Off 🎉", "success");
    } else {
      showToast("Invalid promo code. Try PALMPURE10 or WELLBEING15", "error");
      return;
    }
    updateCartUI();
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
          <p style="font-size: 1.2rem; color: #78716C;">No items found matching your filter criteria.</p>
          <button class="btn-outline" style="margin-top: 14px;" onclick="window.PalmyraApp.setCategory('all')">View All Products</button>
        </div>
      `;
      return;
    }

    elements.productsGrid.innerHTML = filtered.map(product => {
      const isWishlisted = state.wishlist.includes(product.id);
      const svgIllustration = window.PRODUCT_SVG_IMAGES && window.PRODUCT_SVG_IMAGES[product.id] 
        ? window.PRODUCT_SVG_IMAGES[product.id] 
        : `<div style="background:#FAF7F2;height:100%;width:100%;display:flex;align-items:center;justify-content:center;color:#1B4D3E;font-size:2rem;font-weight:bold;">${product.name[0]}</div>`;

      const defaultWeight = product.weightOptions[0];

      return `
        <div class="product-card" data-id="${product.id}">
          <div class="product-badge">${product.badge}</div>
          <button class="wishlist-btn ${isWishlisted ? 'active' : ''}" onclick="window.PalmyraApp.toggleWishlist('${product.id}')" title="Save to Wishlist">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="${isWishlisted ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
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
              <span style="font-weight:700;">${product.rating}</span>
              <span style="color:#78716C;">(${product.reviewCount} reviews)</span>
            </div>

            <p class="product-desc-snippet">${product.shortDescription}</p>

            <div class="product-price-row">
              <span class="current-price">₹${defaultWeight.price}</span>
              <span class="original-price">₹${defaultWeight.originalPrice}</span>
              <span class="discount-tag">Save ₹${defaultWeight.originalPrice - defaultWeight.price}</span>
            </div>

            <div class="card-actions">
              <button class="btn-card-add" onclick="window.PalmyraApp.addToCart('${product.id}', 0, 1)">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <path d="M16 10a4 4 0 0 1-8 0"></path>
                </svg>
                Add to Cart
              </button>
              <button class="btn-card-view" onclick="window.PalmyraApp.openQuickView('${product.id}')">
                Quick View
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
            <div style="background: #FBF8F2; border-radius: 16px; padding: 20px; display:flex; align-items:center; justify-content:center; border: 1px solid #E7DFD5;">
              ${svgIllustration}
            </div>

            <div>
              <div class="hero-pill" style="margin-bottom: 8px;">${product.badge}</div>
              <h2 style="font-size: 1.8rem; margin-bottom: 4px;">${product.name}</h2>
              <div style="font-style: italic; color: #78716C; margin-bottom: 12px; font-size: 0.9rem;">${product.tamilName}</div>
              
              <div class="product-price-row" style="margin-bottom: 16px;">
                <span class="current-price" style="font-size: 1.8rem;">₹${currentOption.price}</span>
                <span class="original-price" style="font-size: 1.1rem;">₹${currentOption.originalPrice}</span>
                <span class="discount-tag">Save ₹${currentOption.originalPrice - currentOption.price}</span>
              </div>

              <p style="color: #44403C; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">
                ${product.fullDescription}
              </p>

              <!-- Weight Selector -->
              <div style="margin-bottom: 20px;">
                <label style="display:block; font-size: 0.85rem; font-weight: 700; color: #1C1917; margin-bottom: 8px;">SELECT PACK SIZE:</label>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;" id="quick-weight-selectors">
                  ${product.weightOptions.map((opt, i) => `
                    <button type="button" class="tab-btn ${i === selectedWeightIndex ? 'active' : ''}" style="padding: 8px 16px; font-size: 0.85rem;" onclick="window.PalmyraApp.switchQuickWeight(${i})">
                      ${opt.weight} (₹${opt.price})
                    </button>
                  `).join("")}
                </div>
              </div>

              <!-- Key Highlights -->
              <div style="background: #FAF7F2; border: 1px solid #E7DFD5; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
                <h4 style="font-size: 0.88rem; margin-bottom: 8px; color: #153E32;">BENCHMARK LAB & HEALTH HIGHLIGHTS:</h4>
                <ul style="padding-left: 20px; font-size: 0.85rem; color: #57534E; line-height: 1.6;">
                  ${product.features.map(f => `<li>${f}</li>`).join("")}
                </ul>
              </div>

              <!-- Nutrition Table Accordion -->
              <div style="margin-bottom: 24px;">
                <h4 style="font-size: 0.88rem; margin-bottom: 8px; color: #153E32;">NUTRITION FACTS (Per 100g):</h4>
                <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 0.8rem;">
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>Energy:</strong> ${product.nutrition.calories}</div>
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>GI Index:</strong> ${product.nutrition.glycemicIndex}</div>
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>Iron:</strong> ${product.nutrition.iron}</div>
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>Potassium:</strong> ${product.nutrition.potassium}</div>
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>Magnesium:</strong> ${product.nutrition.magnesium}</div>
                  <div style="background: #F1ECE1; padding: 8px; border-radius: 6px;"><strong>Calcium:</strong> ${product.nutrition.calcium}</div>
                </div>
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

  // Recipe Modal
  function openRecipeModal(recipeId) {
    const recipe = window.RECIPES_DATA.find(r => r.id === recipeId);
    if (!recipe || !elements.recipeModal) return;

    elements.recipeModal.innerHTML = `
      <div class="modal-container" style="padding: 36px; max-width: 720px;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('recipe-modal')">✕</button>
        
        <span class="hero-pill" style="margin-bottom: 8px;">${recipe.category.toUpperCase()} • ${recipe.time}</span>
        <h2 style="font-size: 2rem; margin-bottom: 8px;">${recipe.title}</h2>
        <p style="color: #57534E; font-size: 0.95rem; line-height: 1.6; margin-bottom: 24px;">${recipe.description}</p>

        <div style="display: grid; grid-template-columns: 1fr 1.3fr; gap: 28px; margin-bottom: 24px;">
          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: #153E32;">Ingredients (${recipe.serving}):</h4>
            <ul style="padding-left: 20px; font-size: 0.88rem; color: #44403C; line-height: 1.7;">
              ${recipe.ingredients.map(ing => `<li>${ing}</li>`).join("")}
            </ul>
          </div>
          <div>
            <h4 style="font-size: 1.05rem; margin-bottom: 12px; color: #153E32;">Method & Steps:</h4>
            <ol style="padding-left: 20px; font-size: 0.88rem; color: #44403C; line-height: 1.7;">
              ${recipe.steps.map(step => `<li>${step}</li>`).join("")}
            </ol>
          </div>
        </div>

        <div style="background: #FEF3C7; border: 1px solid #FDE68A; border-radius: 12px; padding: 16px; margin-bottom: 24px; font-size: 0.88rem; color: #78350F;">
          <strong>💡 Master Chef Note:</strong> ${recipe.proTip}
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; background: #FAF7F2; padding: 14px 20px; border-radius: 12px; border: 1px solid #E7DFD5;">
          <div>
            <div style="font-size: 0.78rem; text-transform: uppercase; color: #78716C; font-weight: 700;">Featured Natural Sweetener:</div>
            <strong style="color: #153E32;">${recipe.heroProductName}</strong>
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

  // Render Recipes Showcase
  function renderRecipes() {
    const container = document.getElementById("recipes-grid");
    if (!container || !window.RECIPES_DATA) return;

    container.innerHTML = window.RECIPES_DATA.map(recipe => `
      <div class="recipe-card">
        <div class="recipe-meta">
          <span>⏱ ${recipe.time}</span>
          <span>•</span>
          <span>🍽 ${recipe.serving}</span>
          <span>•</span>
          <span>⭐ ${recipe.difficulty}</span>
        </div>
        <h3 class="recipe-title">${recipe.title}</h3>
        <p class="recipe-desc">${recipe.description}</p>
        <a href="javascript:void(0)" class="recipe-product-link" onclick="window.PalmyraApp.openQuickView('${recipe.heroProduct}')">
          <span>🌿 Key Ingredient: ${recipe.heroProductName}</span>
          <span>→</span>
        </a>
        <button class="btn-view-recipe" onclick="window.PalmyraApp.openRecipeModal('${recipe.id}')">
          View Recipe & Steps
        </button>
      </div>
    `).join("");
  }

  // Render Glycemic Index Comparison Chart
  function renderBenchmarkGI() {
    const container = document.getElementById("gi-bars-container");
    if (!container || !window.BENCHMARK_DATA) return;

    container.innerHTML = window.BENCHMARK_DATA.glycemicIndex.map(item => `
      <div class="gi-bar-item">
        <div class="gi-bar-label">
          ${item.highlight ? '★ ' : ''}<strong>${item.name}</strong>
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
        <td><strong>${row.parameter}</strong></td>
        <td class="highlight">${row.palmyraPalm}</td>
        <td>${row.whiteSugar}</td>
        <td>${row.brownSugar}</td>
        <td>${row.commercialHoney}</td>
        <td style="font-size: 0.82rem; color: #166534; font-weight: 600;">${row.verdict}</td>
      </tr>
    `).join("");
  }

  // Checkout Flow Simulation
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
        <h2 style="font-size: 1.8rem; margin-bottom: 6px;">Express Checkout</h2>
        <p style="color: #78716C; font-size: 0.88rem; margin-bottom: 24px;">Direct farm-to-table unrefined organic palm superfoods.</p>

        <form id="checkout-form" onsubmit="window.PalmyraApp.processCheckout(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">FULL NAME *</label>
              <input type="text" required placeholder="Priya Ramanathan" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">PHONE NUMBER *</label>
              <input type="tel" required placeholder="+91 98765 43210" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">EMAIL ADDRESS *</label>
            <input type="email" required placeholder="priya@example.com" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">DELIVERY ADDRESS *</label>
            <textarea required rows="2" placeholder="House #, Street name, Landmark" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;"></textarea>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px;">
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">CITY / STATE *</label>
              <input type="text" required placeholder="Chennai, Tamil Nadu" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">PINCODE *</label>
              <input type="text" required placeholder="600028" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
          </div>

          <!-- Payment Options -->
          <div style="margin-bottom: 24px;">
            <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 10px;">PAYMENT METHOD</label>
            <div style="display: flex; gap: 12px; flex-wrap: wrap;">
              <label style="flex:1; border: 1.5px solid #153E32; padding: 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.88rem; background: #F0FDF4;">
                <input type="radio" name="payment" value="upi" checked>
                <span>Instant UPI / QR Code</span>
              </label>
              <label style="flex:1; border: 1px solid #E7DFD5; padding: 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.88rem;">
                <input type="radio" name="payment" value="card">
                <span>Credit / Debit Card</span>
              </label>
              <label style="flex:1; border: 1px solid #E7DFD5; padding: 12px; border-radius: 8px; cursor: pointer; display: flex; align-items: center; gap: 8px; font-weight: 600; font-size: 0.88rem;">
                <input type="radio" name="payment" value="cod">
                <span>Cash on Delivery</span>
              </label>
            </div>
          </div>

          <!-- Order Summary in Checkout -->
          <div style="background: #FAF7F2; border: 1px solid #E7DFD5; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 6px;">
              <span>Items Total (${state.cart.length} unique items):</span>
              <strong>₹${subtotal}</strong>
            </div>
            ${discount > 0 ? `
              <div style="display: flex; justify-content: space-between; font-size: 0.88rem; color: #166534; margin-bottom: 6px;">
                <span>Discount (${state.appliedDiscount.code}):</span>
                <strong>-₹${discount}</strong>
              </div>
            ` : ''}
            <div style="display: flex; justify-content: space-between; font-size: 0.88rem; margin-bottom: 8px;">
              <span>Delivery Charges:</span>
              <strong style="color: ${shipping === 0 ? '#16A34A' : 'inherit'};">${shipping === 0 ? 'FREE' : '₹' + shipping}</strong>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 1.15rem; font-weight: 800; border-top: 1px dashed #D4C9BA; padding-top: 8px; color: #153E32;">
              <span>Total Payable Amount:</span>
              <span>₹${finalTotal}</span>
            </div>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 16px; font-size: 1.05rem; justify-content: center;">
            Confirm Order & Pay ₹${finalTotal}
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
        <div style="width: 64px; height: 64px; background: #DCFCE7; color: #15803D; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2rem; margin: 0 auto 16px;">
          ✓
        </div>
        <h2 style="font-size: 1.9rem; margin-bottom: 8px; color: #153E32;">Order Placed Successfully!</h2>
        <p style="color: #78716C; margin-bottom: 24px;">Thank you for embracing pure, low-GI Palmyra palm wellness.</p>

        <div style="background: #FAF7F2; border: 1px solid #E7DFD5; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px; font-size: 0.9rem;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #78716C;">Order Reference ID:</span>
            <strong>#${orderId}</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #78716C;">Estimated Delivery:</span>
            <strong>3 - 5 Business Days</strong>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="color: #78716C;">Total Paid:</span>
            <strong style="color: #153E32; font-size: 1.1rem;">₹${finalTotal}</strong>
          </div>
          <div style="display: flex; justify-content: space-between;">
            <span style="color: #78716C;">Quality Assurance:</span>
            <strong style="color: #15803D;">NABL Lab Batch Verified</strong>
          </div>
        </div>

        <button class="btn-primary" style="margin: 0 auto;" onclick="window.PalmyraApp.closeModal('checkout-modal'); window.print();">
          🖨 Print / Save Order Receipt
        </button>
      </div>
    `;

    // Clear cart
    state.cart = [];
    state.appliedDiscount = null;
    saveCart();
    showToast("Order confirmed! Receipt generated.", "success");
  }

  // B2B Wholesale Modal
  function openB2BModal() {
    elements.b2bModal.innerHTML = `
      <div class="modal-container" style="padding: 36px; max-width: 650px;">
        <button class="modal-close-corner" onclick="window.PalmyraApp.closeModal('b2b-modal')">✕</button>
        <span class="hero-pill" style="margin-bottom: 8px;">B2B & BULK EXPORT</span>
        <h2 style="font-size: 1.8rem; margin-bottom: 8px;">Wholesale & Private Label Inquiry</h2>
        <p style="color: #57534E; font-size: 0.88rem; line-height: 1.5; margin-bottom: 24px;">
          Supplying certified Low-GI Crystallized Palm Jaggery, Panakarkandu Crystals, and Prebiotic Palm Flour to bakeries, cafe chains, health brands, and export distributors worldwide.
        </p>

        <form onsubmit="window.PalmyraApp.submitB2BForm(event)">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">COMPANY / BRAND NAME *</label>
              <input type="text" required placeholder="Nature's Hearth Cafe" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">CONTACT PERSON *</label>
              <input type="text" required placeholder="Arun Verma" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">BUSINESS EMAIL *</label>
              <input type="email" required placeholder="purchasing@company.com" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
            <div>
              <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">PHONE / WHATSAPP *</label>
              <input type="tel" required placeholder="+91 99887 76655" style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;">
            </div>
          </div>

          <div style="margin-bottom: 16px;">
            <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">INTERESTED PRODUCTS & ESTIMATED VOLUME *</label>
            <select required style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px; background: white;">
              <option value="">Select product of interest...</option>
              <option value="crystallized">Granulated / Crystallized Palm Jaggery (50kg+ / month)</option>
              <option value="crystals">Panakarkandu Palm Crystals (25kg+ / month)</option>
              <option value="blocks">Traditional Karupatti Solid Shell Blocks</option>
              <option value="sprout">Palmyra Sprout Prebiotic Flour (Bulk)</option>
              <option value="millets">Organic Millet Flakes & Superfoods</option>
              <option value="private_label">Complete Private Label OEM Packaging</option>
            </select>
          </div>

          <div style="margin-bottom: 24px;">
            <label style="display:block; font-size: 0.82rem; font-weight: 700; margin-bottom: 6px;">ADDITIONAL SPECIFICATIONS / CERTIFICATE NEEDS</label>
            <textarea rows="3" placeholder="Tell us about your delivery destination, export requirements, or custom packaging..." style="width:100%; padding: 10px 14px; border:1px solid #E7DFD5; border-radius: 8px;"></textarea>
          </div>

          <button type="submit" class="btn-primary" style="width: 100%; padding: 14px; font-size: 1rem; justify-content: center;">
            Submit Wholesale Request
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
    showToast("Wholesale inquiry received! Our trade manager will contact you within 24 hours.", "success");
  }

  // Modal Generic Close
  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.classList.remove("open");
    document.body.style.overflow = "";
  }

  // Category Filter Setup
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
    // Cart open/close triggers
    const cartOpenBtn = document.getElementById("cart-open-btn");
    const cartCloseBtn = document.getElementById("cart-close-btn");

    if (cartOpenBtn) cartOpenBtn.addEventListener("click", openCart);
    if (cartCloseBtn) cartCloseBtn.addEventListener("click", closeCart);
    if (elements.cartOverlay) elements.cartOverlay.addEventListener("click", closeCart);

    // Apply Coupon
    if (elements.couponBtn) elements.couponBtn.addEventListener("click", applyCoupon);

    // Checkout Open
    const checkoutBtn = document.getElementById("cart-checkout-btn");
    if (checkoutBtn) checkoutBtn.addEventListener("click", openCheckout);

    // Category Tabs Click
    if (elements.catalogTabs) {
      elements.catalogTabs.addEventListener("click", (e) => {
        const btn = e.target.closest(".tab-btn");
        if (btn) setCategory(btn.dataset.category);
      });
    }

    // Live Search
    const searchInput = document.getElementById("nav-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value.trim();
        renderProducts();
      });
    }

    // Modal background click to close
    [elements.quickViewModal, elements.recipeModal, elements.checkoutModal, elements.b2bModal].forEach(modal => {
      if (!modal) return;
      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal(modal.id);
      });
    });

    // Close on Escape key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCart();
        closeModal("quick-view-modal");
        closeModal("recipe-modal");
        closeModal("checkout-modal");
        closeModal("b2b-modal");
      }
    });

    // Mobile nav toggle
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
        navLinks.style.background = "#FAF7F2";
        navLinks.style.padding = "20px";
        navLinks.style.borderBottom = "1px solid #E7DFD5";
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

    if (window.initSugarCalculator) {
      window.initSugarCalculator();
    }
  }

  // Expose API to window for inline onclick handlers
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
    showToast
  };

  // Run when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
