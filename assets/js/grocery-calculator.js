// Grocery Calculator Variables
const modeSlider = document.getElementById('modeSlider');
const gramModeBtn = document.getElementById('gramModeBtn');
const kgModeBtn = document.getElementById('kgModeBtn');
const gramMode = document.getElementById('gramMode');
const kgModeDiv = document.getElementById('kgMode');
const pricePerKgInput = document.getElementById('pricePerKg');
const pricePerKgInput2 = document.getElementById('pricePerKg2');
const quantityGramsInput = document.getElementById('quantityGrams');
const quantityKgInput = document.getElementById('quantityKg');
const pricePerGramDisplay = document.getElementById('pricePerGram');
const gramTotalPriceDisplay = document.getElementById('gramTotalPrice');
const kgTotalPriceDisplay = document.getElementById('kgTotalPrice');
const calculateBtn = document.getElementById('calculateBtn');
const clearBtn = document.getElementById('clearBtn');

let isGramMode = true;

// Toggle between modes
gramModeBtn.addEventListener('click', () => {
    if (!isGramMode) {
        switchMode(true);
    }
});

kgModeBtn.addEventListener('click', () => {
    if (isGramMode) {
        switchMode(false);
    }
});

// Function to switch between modes
function switchMode(toGramMode) {
    isGramMode = toGramMode;
    
    // Update toggle UI
    if (isGramMode) {
        modeSlider.style.transform = 'translateX(0)';
        gramModeBtn.classList.add('active');
        kgModeBtn.classList.remove('active');
        gramMode.style.display = 'flex';
        kgModeDiv.style.display = 'none';
    } else {
        modeSlider.style.transform = 'translateX(100%)';
        gramModeBtn.classList.remove('active');
        kgModeBtn.classList.add('active');
        gramMode.style.display = 'none';
        kgModeDiv.style.display = 'flex';
    }
    
    // Calculate based on current inputs
    calculateGrocery();
}

// Calculate price per gram when price per kg changes
pricePerKgInput.addEventListener('input', () => {
    const pricePerKg = parseFloat(pricePerKgInput.value) || 0;
    const pricePerGram = pricePerKg / 1000;
    pricePerGramDisplay.textContent = `₹${pricePerGram.toFixed(3)}`;
    
    // Sync price with second input
    pricePerKgInput2.value = pricePerKg;
    
    calculateGrocery();
});

// Sync price inputs
pricePerKgInput2.addEventListener('input', () => {
    const pricePerKg = parseFloat(pricePerKgInput2.value) || 0;
    pricePerKgInput.value = pricePerKg;
    
    // Update price per gram display
    const pricePerGram = pricePerKg / 1000;
    pricePerGramDisplay.textContent = `₹${pricePerGram.toFixed(3)}`;
    
    calculateGrocery();
});

// Calculate when quantity changes
quantityGramsInput.addEventListener('input', calculateGrocery);
quantityKgInput.addEventListener('input', calculateGrocery);

// Calculate button
calculateBtn.addEventListener('click', calculateGrocery);

// Clear button
clearBtn.addEventListener('click', clearGrocery);

// Main calculation function for grocery calculator
function calculateGrocery() {
    if (isGramMode) {
        // Gram mode calculation
        const pricePerKg = parseFloat(pricePerKgInput.value) || 0;
        const quantityGrams = parseFloat(quantityGramsInput.value) || 0;
        const totalPrice = (pricePerKg / 1000) * quantityGrams;
        gramTotalPriceDisplay.textContent = `₹${totalPrice.toFixed(2)}`;
        
        // Add animation
        gramTotalPriceDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            gramTotalPriceDisplay.style.transform = 'scale(1)';
        }, 200);
    } else {
        // Kg mode calculation
        const quantityKg = parseFloat(quantityKgInput.value) || 0;
        const pricePerKg = parseFloat(pricePerKgInput2.value) || 0;
        const totalPrice = quantityKg * pricePerKg;
        kgTotalPriceDisplay.textContent = `₹${totalPrice.toFixed(2)}`;
        
        // Add animation
        kgTotalPriceDisplay.style.transform = 'scale(1.05)';
        setTimeout(() => {
            kgTotalPriceDisplay.style.transform = 'scale(1)';
        }, 200);
    }
}

// Clear all inputs in grocery calculator
function clearGrocery() {
    pricePerKgInput.value = '';
    pricePerKgInput2.value = '';
    quantityGramsInput.value = '';
    quantityKgInput.value = '';
    pricePerGramDisplay.textContent = '₹0.000';
    gramTotalPriceDisplay.textContent = '₹0';
    kgTotalPriceDisplay.textContent = '₹0';
    
    // Add animation to reset
    const resultDisplays = [gramTotalPriceDisplay, kgTotalPriceDisplay];
    resultDisplays.forEach(display => {
        display.style.transform = 'scale(0.9)';
        setTimeout(() => {
            display.style.transform = 'scale(1)';
        }, 300);
    });
}

// Initialize with example values for grocery calculator
function initGroceryDemo() {
    pricePerKgInput.value = 85;
    pricePerKgInput2.value = 85;
    quantityGramsInput.value = 350;
    quantityKgInput.value = 1.5;
    
    // Trigger calculations
    const pricePerKg = parseFloat(pricePerKgInput.value) || 0;
    const pricePerGram = pricePerKg / 1000;
    pricePerGramDisplay.textContent = `₹${pricePerGram.toFixed(3)}`;
    
    calculateGrocery();
}

// Initialize the grocery calculator
document.addEventListener('DOMContentLoaded', initGroceryDemo);