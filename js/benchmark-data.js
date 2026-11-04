// Benchmark Dataset: Palmyra Palm Tree vs Conventional Sweeteners
// Derived and cross-referenced with Wellbeing Organic (wellbeingorganic.com) & NABL Lab Reports

window.BENCHMARK_DATA = {
  glycemicIndex: [
    { name: "Palmyra Palm Jaggery", gi: 35, category: "Low GI", color: "#166534", highlight: true },
    { name: "Palm Sugar Crystals (Panakarkandu)", gi: 35, category: "Low GI", color: "#15803d", highlight: true },
    { name: "Unrefined Coconut Sugar", gi: 54, category: "Low-Med GI", color: "#854d0e", highlight: false },
    { name: "Raw Honey", gi: 58, category: "Medium GI", color: "#ca8a04", highlight: false },
    { name: "Cane Jaggery Powder", gi: 60, category: "Medium GI", color: "#b45309", highlight: false },
    { name: "Brown Table Sugar", gi: 64, category: "High GI", color: "#c2410c", highlight: false },
    { name: "Refined White Sugar", gi: 68, category: "High GI (Dangerous Spike)", color: "#b91c1c", highlight: false },
    { name: "Pure Glucose", gi: 100, category: "Reference Benchmark", color: "#7f1d1d", highlight: false }
  ],

  mineralsComparison: {
    labels: ["Iron (mg)", "Potassium (mg)", "Magnesium (mg)", "Calcium (mg)", "Phosphorus (mg)"],
    palmyraPalm: [11.2, 1050, 70.0, 76.0, 24.0],
    whiteSugar: [0.05, 2.0, 0.1, 1.0, 0.0],
    brownSugar: [1.9, 133, 9.0, 83.0, 4.0],
    caneJaggery: [3.5, 300, 25.0, 40.0, 15.0]
  },

  comparisonTable: [
    {
      parameter: "Glycemic Index (GI)",
      palmyraPalm: "35 (Clinically Low GI)",
      whiteSugar: "68 (High Spike)",
      brownSugar: "64 (High Spike)",
      commercialHoney: "58 (Medium)",
      verdict: "Palmyra releases steady glucose without insulin surges."
    },
    {
      parameter: "Extraction Method",
      palmyraPalm: "Dawn-harvested sap from wild palms",
      whiteSugar: "Intensive chemical sugarcane extraction",
      brownSugar: "Refined sugar re-coated with molasses",
      commercialHoney: "Often heat-treated and micro-filtered",
      verdict: "100% natural evaporation in traditional vessels."
    },
    {
      parameter: "Refining & Chemical Bleaching",
      palmyraPalm: "Zero chemicals, Zero Sulfur, Zero Hydros",
      whiteSugar: "Bleached with Sulfur Dioxide & Bone Char",
      brownSugar: "Industrial centrifugal processing",
      commercialHoney: "Often adulterated with high-fructose corn syrup",
      verdict: "Purity guaranteed by accredited NABL lab tests."
    },
    {
      parameter: "Iron Content (per 100g)",
      palmyraPalm: "11.2 mg (Natural Hemoglobin Booster)",
      whiteSugar: "0.05 mg (Negligible)",
      brownSugar: "1.9 mg",
      commercialHoney: "0.4 mg",
      verdict: "Palmyra has over 60x the bioavailable iron."
    },
    {
      parameter: "Electrolytes (Potassium/100g)",
      palmyraPalm: "1,050 mg (Hydration & BP balance)",
      whiteSugar: "2 mg",
      brownSugar: "133 mg",
      commercialHoney: "52 mg",
      verdict: "One of nature's richest plant potassium sources."
    },
    {
      parameter: "Taste Profile",
      palmyraPalm: "Deep warm caramel with toasted malt undertones",
      whiteSugar: "Harsh, one-dimensional sweet",
      brownSugar: "Sticky molasses sweetness",
      commercialHoney: "Floral, highly sweet",
      verdict: "Subtle complex gourmet flavor profile."
    },
    {
      parameter: "Ecological Water Footprint",
      palmyraPalm: "Zero ground water (Thrives in arid wild soils)",
      whiteSugar: "1,500 - 3,000 Litres water/kg cane",
      brownSugar: "1,500 - 3,000 Litres water/kg",
      commercialHoney: "Moderate",
      verdict: "Palmyra palm requires zero irrigation or pesticides."
    }
  ],

  labStandards: [
    {
      test: "Adulteration & Sucrose Ratio",
      method: "HPLC-MS Chromatography",
      standard: "Zero synthetic sugar / Corn syrup detected",
      status: "PASS (100% Genuine Sap)"
    },
    {
      test: "Sulfur Dioxide (SO2)",
      method: "Monier-Williams Titration",
      standard: "Below Limit of Detection (< 2.0 ppm)",
      status: "PASS (Zero Chemical Bleach)"
    },
    {
      test: "Heavy Metal Screen (Lead, Arsenic, Cadmium)",
      method: "ICP-MS Spectrometry",
      standard: "Complies with FSSAI & EU Safety Thresholds",
      status: "PASS (Ultra-Pure Organic)"
    },
    {
      test: "Total Dietary Fiber & Inulin Prebiotics",
      method: "AOAC 991.43",
      standard: "Contains natural oligosaccharides",
      status: "PASS (Gut-friendly Low GI)"
    }
  ]
};
