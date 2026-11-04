# 🌴 Palmyra Palm Tree — Heritage Superfoods & Low-GI Sweeteners

> High-performance, modern e-commerce storefront, Glycemic Index clinical education center, and heritage superfoods platform for the sacred Palmyra Palm (*Borassus flabellifer*), benchmarked against [Wellbeing Organic / Wellbeing Superfoods](https://wellbeingorganic.com/).

---

## 🌟 Benchmarking Highlights (from `wellbeingorganic.com`)

Our platform was architected by systematically benchmarking the product categories, nutritional claims, clinical glycemic data, and heritage processing of **Wellbeing Organic**:

1. **Pioneering Low Glycemic Index (GI 35)**:
   - Refined white sugar causes sharp insulin spikes (GI 68), while Palmyra Palm Jaggery has a clinically tested Low GI of ~35.
   - Rich in bioavailable iron (11.2 mg / 100g) and potassium (1,050 mg / 100g).
2. **Product Catalog Parity & Innovations**:
   - **Crystallized Palm Jaggery (Karupatti)**: Granulated, free-flowing, replaces white sugar on a 1:1 basis.
   - **Palm Sugar Crystals (Panakarkandu / Tal Mishri)**: Unbleached amber crystals for Ayurvedic cough & throat soothe.
   - **Dry Ginger & Pepper Palm Jaggery (Sukku Karupatti)**: Formulated for traditional digestive wellness and cold brews.
   - **Unrefined Coconut Palm Blossom Sugar**: Low-GI baking sweetener.
   - **Organic Millet Flakes**: Whole grain Finger Millet Flakes (Ragi Aval) with 344mg Calcium and Multi-Millet Flakes.
   - **Palmyra Sprout Prebiotic Flour (Panai Kizhangu)**: South Indian high-inulin prebiotic root flour.
   - **Handwoven Palmyra Leaf Baskets**: Celebrating zero-waste living and traditional women artisan weavers.
3. **NABL Lab Standards**:
   - Monier-Williams Titration for zero sulfur dioxide bleaching (< 2.0 ppm).
   - HPLC sugar profiling to ensure 100% pure wild sap with zero added cane syrup or corn syrup.

Read the detailed benchmark report in [`benchmark/WELLBEING_BENCHMARK.md`](file:///i:/My%20Drive/Palmyera%20Palm%20Tree/benchmark/WELLBEING_BENCHMARK.md).

---

## 🚀 Key Website Features

- **Interactive Sugar Swap & Health ROI Calculator**:
  Calculates annual refined white sugar eliminated, insulin spike risk reduction (48.5%), bioavailable iron gained, and potassium added based on daily beverage consumption.
- **Dynamic E-Commerce Catalog & Quick View**:
  Filter by Low-GI Sweeteners, Panakarkandu Crystals, Millets & Flakes, Prebiotics, and Eco-Crafts. Interactive pack-size selectors with instant price adjustments.
- **Slide-over Cart & Checkout Experience**:
  - Live subtotal and free shipping progress meter (Threshold: ₹499).
  - Discount coupon engine (`PALMPURE10` for 10% off, `WELLBEING15` for 15% off).
  - Integrated Express Checkout simulation with UPI / Card / COD and instant printable receipt.
- **Scientific Glycemic Index (GI) Explorer**:
  Dynamic comparative bar charts and nutritional matrix comparing Palmyra Palm vs White Sugar, Brown Sugar, and Honey.
- **Heritage Farm-to-Cup Journey**:
  Illustrated 5-step process from dawn sap harvesting to clay filtration and cast-iron evaporation.
- **Heritage Culinary & Wellness Recipes**:
  Interactive recipe cards with step-by-step instructions (Karupatti Filter Coffee, Sukku Malli Brew, Golden Milk) and direct ingredient add-to-cart.
- **B2B Bulk & Export Modal**:
  Wholesale inquiry system for cafe chains, bakeries, and international distributors.
- **Zero-Dependency SVG Graphics**:
  Hand-crafted high-resolution vector illustrations for every product to ensure instantaneous offline loading with zero missing assets.

---

## 💻 How to Run Locally

### Option 1: Direct File Open
Double click or open `index.html` in any modern web browser (Chrome, Edge, Firefox, Safari).

### Option 2: Using Node / npx
```bash
npx serve .
# Or
cmd.exe /c npm start
```

### Option 3: Using Python
```bash
python -m http.server 8000
```
Open `http://localhost:8000` in your browser.

---

## 📁 Repository Structure

```
├── index.html                  # Main interactive application
├── css/
│   └── styles.css              # Custom styling, responsive layout, earthy organic palette
├── js/
│   ├── app.js                  # Main controller, cart, modals, search & filters
│   ├── products-data.js        # Products catalog benchmarked from wellbeingorganic.com
│   ├── benchmark-data.js       # GI and mineral comparison datasets & lab standards
│   ├── calculator.js           # Interactive Sugar-Swap & Health ROI Calculator
│   └── recipes-data.js         # Heritage culinary recipes
├── assets/
│   └── product-images.js       # High-resolution vector product illustrations
├── benchmark/
│   └── WELLBEING_BENCHMARK.md  # Detailed benchmark report of wellbeingorganic.com
├── package.json
└── README.md
```
