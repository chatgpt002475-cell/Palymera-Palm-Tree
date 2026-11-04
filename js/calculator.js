// Interactive Sugar Swap & Health ROI Calculator
// Compares White Sugar vs Pure Palmyra Palm Jaggery based on clinical nutritional values

function initSugarCalculator() {
  const cupsInput = document.getElementById("calc-cups");
  const spoonsInput = document.getElementById("calc-spoons");
  const membersInput = document.getElementById("calc-members");

  const cupsVal = document.getElementById("calc-cups-val");
  const spoonsVal = document.getElementById("calc-spoons-val");
  const membersVal = document.getElementById("calc-members-val");

  const annualSugarEl = document.getElementById("calc-annual-sugar");
  const annualIronEl = document.getElementById("calc-annual-iron");
  const annualPotassiumEl = document.getElementById("calc-annual-potassium");
  const spikeReductionEl = document.getElementById("calc-spike-reduction");
  const recommendationEl = document.getElementById("calc-recommendation");

  if (!cupsInput || !spoonsInput || !membersInput) return;

  function calculate() {
    const cups = parseFloat(cupsInput.value) || 2;
    const spoons = parseFloat(spoonsInput.value) || 2;
    const members = parseInt(membersInput.value) || 2;

    if (cupsVal) cupsVal.textContent = cups === 1 ? "1 cup" : `${cups} cups`;
    if (spoonsVal) spoonsVal.textContent = spoons === 1 ? "1 tsp" : `${spoons} tsp`;
    if (membersVal) membersVal.textContent = members === 1 ? "1 person" : `${members} people`;

    // 1 teaspoon of sugar ~= 4.2 grams
    const gramsPerCup = spoons * 4.2;
    const dailyGramsPerPerson = cups * gramsPerCup;
    const dailyTotalGrams = dailyGramsPerPerson * members;
    const annualKg = (dailyTotalGrams * 365) / 1000;

    // Palmyra Palm Jaggery Nutrients per 100g:
    // Iron: 11.2 mg
    // Potassium: 1,050 mg
    // Magnesium: 70 mg
    // GI comparison: 35 vs 68 (~48.5% lower glycemic spike)
    const annualIronMg = Math.round((annualKg * 10) * 11.2);
    const annualPotassiumMg = Math.round((annualKg * 10) * 1050);

    if (annualSugarEl) {
      annualSugarEl.textContent = `${annualKg.toFixed(1)} kg`;
    }
    if (annualIronEl) {
      annualIronEl.textContent = `${annualIronMg.toLocaleString()} mg`;
    }
    if (annualPotassiumEl) {
      annualPotassiumEl.textContent = `${(annualPotassiumMg / 1000).toFixed(1)} g`;
    }
    if (spikeReductionEl) {
      spikeReductionEl.textContent = "48.5% Lower";
    }

    if (recommendationEl) {
      let recText = "";
      let recProduct = "palmyra-crystallized-jaggery";
      if (members >= 4 || annualKg > 20) {
        recText = `Your household will swap <strong>${annualKg.toFixed(1)} kg</strong> of white sugar! We recommend the <strong>Family Value 2kg Jar of Crystallized Palm Jaggery</strong> + <strong>Sukku Karupatti</strong> for winter mornings.`;
      } else if (members === 1) {
        recText = `As a single wellness explorer, switching ${annualKg.toFixed(1)} kg per year will add <strong>${annualIronMg} mg of pure bioavailable iron</strong> to your coffee. We recommend the <strong>400g Pouch</strong> with our <strong>Panakarkandu Crystals</strong>.`;
      } else {
        recText = `For your family of ${members}, replacing ${annualKg.toFixed(1)} kg of refined sugar will slash daily insulin spikes by <strong>48.5%</strong>. Try the <strong>800g Value Pack</strong>.`;
      }
      recommendationEl.innerHTML = recText;
    }
  }

  cupsInput.addEventListener("input", calculate);
  spoonsInput.addEventListener("input", calculate);
  membersInput.addEventListener("input", calculate);

  // Initial calculation
  calculate();
}

window.initSugarCalculator = initSugarCalculator;
