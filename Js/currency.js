// ===== Sidebar =====
const hamburgerBtn = document.getElementById('hamburgerBtn');
const sidebar = document.getElementById('sidebar');
const sidebarOverlay = document.getElementById('sidebarOverlay');

if (hamburgerBtn && sidebar && sidebarOverlay) {
    hamburgerBtn.addEventListener('click', () => {
        sidebar.classList.add('active');
        sidebarOverlay.classList.add('active');
    });
    sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('active');
        sidebarOverlay.classList.remove('active');
    });
}

const allCalcToggle = document.getElementById('allCalcToggle');
if (allCalcToggle) {
    allCalcToggle.addEventListener('click', (e) => {
        e.preventDefault();
        allCalcToggle.closest('.has-dropdown').classList.toggle('open');
    });
}

// ===== Currency Converter =====

// Common symbols. Frankfurter's currency list drives the dropdowns; this map
// just prettifies the ones people recognize on sight. Anything missing here
// simply falls back to showing its 3-letter code.
const SYMBOLS = {
    INR: '₹', USD: '$', EUR: '€', GBP: '£', JPY: '¥', CNY: '¥',
    AUD: 'A$', CAD: 'C$', CHF: 'Fr', SGD: 'S$', HKD: 'HK$', NZD: 'NZ$',
    ZAR: 'R', KRW: '₩', BRL: 'R$', MXN: '$', SEK: 'kr', NOK: 'kr',
    DKK: 'kr', PLN: 'zł', THB: '฿', TRY: '₺', ILS: '₪', IDR: 'Rp',
    PHP: '₱', MYR: 'RM', CZK: 'Kč', HUF: 'Ft', RON: 'lei', BGN: 'лв',
    ISK: 'kr'
};

// Fallback list used only if the live currency-list fetch fails (e.g. offline).
const FALLBACK_CURRENCIES = {
    INR: 'Indian Rupee', USD: 'US Dollar', EUR: 'Euro', GBP: 'British Pound',
    JPY: 'Japanese Yen', AUD: 'Australian Dollar', CAD: 'Canadian Dollar',
    CHF: 'Swiss Franc', CNY: 'Chinese Yuan', SGD: 'Singapore Dollar',
    HKD: 'Hong Kong Dollar', NZD: 'New Zealand Dollar', ZAR: 'South African Rand',
    KRW: 'South Korean Won', BRL: 'Brazilian Real', MXN: 'Mexican Peso',
    THB: 'Thai Baht', TRY: 'Turkish Lira', AED: 'UAE Dirham'
};

const API_BASE = 'https://api.frankfurter.dev/v1';
const DEFAULT_FROM = 'INR';
const DEFAULT_TO = 'USD';

const amountInput = document.getElementById('amountInput');
const convertedOutput = document.getElementById('convertedOutput');
const fromCurrency = document.getElementById('fromCurrency');
const toCurrency = document.getElementById('toCurrency');
const fromSymbol = document.getElementById('fromSymbol');
const toSymbol = document.getElementById('toSymbol');
const amountSymbol = document.getElementById('amountSymbol');
const swapBtn = document.getElementById('swapBtn');
const rateNote = document.getElementById('rateNote');
const rateOutput = document.getElementById('rateOutput');
const rateBox = document.getElementById('rateBox');
const convertedBox = document.getElementById('convertedBox');
const clearBtn = document.getElementById('clear');
const calculateBtn = document.getElementById('calculate');
const amountDiv = document.getElementById('amountDiv');

let currentRate = null;
let debounceTimer = null;

function symbolFor(code) {
    return SYMBOLS[code] || code;
}

function populateSelect(select, currencies, selected) {
    select.innerHTML = '';
    Object.keys(currencies).sort().forEach(code => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = `${code} — ${currencies[code]}`;
        if (code === selected) opt.selected = true;
        select.appendChild(opt);
    });
}

async function loadCurrencyList() {
    try {
        const res = await fetch(`${API_BASE}/currencies`);
        if (!res.ok) throw new Error('bad response');
        const data = await res.json();
        // Frankfurter doesn't return INR base itself in this list by default on
        // all mirrors, so make sure our default currency is always selectable.
        if (!data.INR) data.INR = 'Indian Rupee';
        populateSelect(fromCurrency, data, DEFAULT_FROM);
        populateSelect(toCurrency, data, DEFAULT_TO);
    } catch (err) {
        populateSelect(fromCurrency, FALLBACK_CURRENCIES, DEFAULT_FROM);
        populateSelect(toCurrency, FALLBACK_CURRENCIES, DEFAULT_TO);
        rateNote.textContent = "Couldn't reach the live rate service — showing a limited offline currency list.";
    }
    fromSymbol.textContent = symbolFor(fromCurrency.value);
    toSymbol.textContent = symbolFor(toCurrency.value);
    amountSymbol.textContent = symbolFor(fromCurrency.value);
}

function shakeField() {
    amountDiv.classList.add('shake');
    setTimeout(() => amountDiv.classList.remove('shake'), 400);
}

function flashResult() {
    rateBox.classList.add('flash');
    convertedBox.classList.add('flash');
    setTimeout(() => {
        rateBox.classList.remove('flash');
        convertedBox.classList.remove('flash');
    }, 450);
}

async function fetchRate(from, to) {
    if (from === to) return 1;
    const res = await fetch(`${API_BASE}/latest?base=${from}&symbols=${to}`);
    if (!res.ok) throw new Error('rate fetch failed');
    const data = await res.json();
    return data.rates[to];
}

async function updateRateAndConvert() {
    const from = fromCurrency.value;
    const to = toCurrency.value;

    rateNote.textContent = 'Fetching live exchange rate…';

    try {
        currentRate = await fetchRate(from, to);
        rateNote.textContent = `Live mid-market rate · updated just now`;
        rateOutput.textContent = `1 ${from} = ${currentRate.toFixed(4)} ${to}`;
        convert();
        flashResult();
    } catch (err) {
        rateNote.textContent = 'Could not fetch the live rate. Check your connection and try again.';
        rateOutput.textContent = '--';
    }
}

function convert() {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount) || amount < 0) {
        shakeField();
        return;
    }

    if (currentRate === null) {
        updateRateAndConvert();
        return;
    }

    const result = amount * currentRate;
    convertedOutput.textContent = `${symbolFor(toCurrency.value)} ${result.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function clearAll() {
    amountInput.value = '';
    convertedOutput.textContent = '0.00';
    rateOutput.textContent = currentRate !== null
        ? `1 ${fromCurrency.value} = ${currentRate.toFixed(4)} ${toCurrency.value}`
        : '--';
}

// ----- Events -----
amountInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convert, 250);
});

fromCurrency.addEventListener('change', () => {
    fromSymbol.textContent = symbolFor(fromCurrency.value);
    amountSymbol.textContent = symbolFor(fromCurrency.value);
    updateRateAndConvert();
});

toCurrency.addEventListener('change', () => {
    toSymbol.textContent = symbolFor(toCurrency.value);
    updateRateAndConvert();
});

swapBtn.addEventListener('click', () => {
    swapBtn.classList.add('spin');
    setTimeout(() => swapBtn.classList.remove('spin'), 350);

    const tempValue = fromCurrency.value;
    const tempIndexFrom = [...fromCurrency.options].findIndex(o => o.value === toCurrency.value);
    const tempIndexTo = [...toCurrency.options].findIndex(o => o.value === tempValue);

    if (tempIndexFrom > -1) fromCurrency.selectedIndex = tempIndexFrom;
    if (tempIndexTo > -1) toCurrency.selectedIndex = tempIndexTo;

    fromSymbol.textContent = symbolFor(fromCurrency.value);
    toSymbol.textContent = symbolFor(toCurrency.value);
    amountSymbol.textContent = symbolFor(fromCurrency.value);
    updateRateAndConvert();
});

calculateBtn.addEventListener('click', updateRateAndConvert);
clearBtn.addEventListener('click', clearAll);

// ----- Init -----
(async function init() {
    await loadCurrencyList();
    updateRateAndConvert();
})();