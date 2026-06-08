// ── Grocery Calculator JS ──────────────────────────────────────────────

const priceInput    = document.getElementById('pricePerKg');
const quantityInput = document.getElementById('quantityGrams');
const calculateBtn  = document.getElementById('calculate');
const clearBtn      = document.getElementById('clear');
const pricePerGramEl = document.querySelector('.price-p-g p');
const totalPriceEl   = document.querySelector('.price-box h2');

// ── Helpers ────────────────────────────────────────────────────────────

function formatPrice(value) {
  // Keep 2 decimal places; show "00.00" style for zero
  return value.toFixed(2);
}

function animateValue(element, from, to, duration = 400) {
  const start = performance.now();
  const update = (time) => {
    const elapsed  = time - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);
    const current = from + (to - from) * ease;
    element.textContent = formatPrice(current);
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function flashElement(element, className = 'flash') {
  element.classList.remove(className);
  void element.offsetWidth; // reflow to restart animation
  element.classList.add(className);
}

// ── Core calculation ───────────────────────────────────────────────────

function calculate() {
  const pricePerKg  = parseFloat(priceInput.value);
  const grams       = parseFloat(quantityInput.value);

  // Validation
  if (isNaN(pricePerKg) || isNaN(grams)) {
    shakeInvalid();
    return;
  }
  if (pricePerKg < 0 || grams < 0) {
    shakeInvalid();
    return;
  }

  const pricePerGram = pricePerKg / 1000;
  const totalPrice   = pricePerGram * grams;

  // Animate to new value
  const prevTotal = parseFloat(totalPriceEl.textContent) || 0;
  animateValue(totalPriceEl, prevTotal, totalPrice);

  // Update price-per-gram display
  pricePerGramEl.textContent = `Price Per 1 Gram : ₹${pricePerGram.toFixed(4)}`;

  // Flash result box
  flashElement(document.querySelector('.price-box'), 'flash');
}

// ── Clear ──────────────────────────────────────────────────────────────

function clearAll() {
  priceInput.value    = '';
  quantityInput.value = '';
  totalPriceEl.textContent    = '00.00';
  pricePerGramEl.textContent  = 'Price Per 1 Gram : 0.00';
  priceInput.focus();
}

// ── Shake animation on invalid input ──────────────────────────────────

function shakeInvalid() {
  [priceInput, quantityInput].forEach(input => {
    if (isNaN(parseFloat(input.value)) || input.value === '') {
      flashElement(input, 'shake');
    }
  });
}

// ── Event listeners ────────────────────────────────────────────────────

calculateBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clearAll);

// Allow Enter key in either field to trigger calculation
[priceInput, quantityInput].forEach(input => {
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') calculate();
  });
  // Remove negative sign from input
  input.addEventListener('input', () => {
    if (parseFloat(input.value) < 0) input.value = '';
  });
});

// ── Hamburger (optional hook — extend as needed) ───────────────────────

document.getElementById('hamburgerBtn').addEventListener('click', () => {
  // Placeholder: toggle a side-drawer or menu if you add one later
  console.log('Menu toggled');
});