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

// ===== Unit Converter =====

// Every category is linear against a base unit (factor = how many base
// units in 1 of this unit) except temperature, which needs real formulas.
const CATEGORIES = {
    length: {
        label: 'Length', icon: 'fa-ruler-horizontal', base: 'm',
        units: {
            m:  { name: 'Meter',      symbol: 'm',   factor: 1 },
            km: { name: 'Kilometer',  symbol: 'km',  factor: 1000 },
            cm: { name: 'Centimeter', symbol: 'cm',  factor: 0.01 },
            mm: { name: 'Millimeter', symbol: 'mm',  factor: 0.001 },
            mi: { name: 'Mile',       symbol: 'mi',  factor: 1609.344 },
            yd: { name: 'Yard',       symbol: 'yd',  factor: 0.9144 },
            ft: { name: 'Foot',       symbol: 'ft',  factor: 0.3048 },
            in: { name: 'Inch',       symbol: 'in',  factor: 0.0254 },
            nmi:{ name: 'Nautical Mile', symbol: 'nmi', factor: 1852 }
        }
    },
    weight: {
        label: 'Weight', icon: 'fa-weight-hanging', base: 'kg',
        units: {
            kg:    { name: 'Kilogram',  symbol: 'kg',    factor: 1 },
            g:     { name: 'Gram',      symbol: 'g',     factor: 0.001 },
            mg:    { name: 'Milligram', symbol: 'mg',    factor: 0.000001 },
            tonne: { name: 'Tonne',     symbol: 't',     factor: 1000 },
            lb:    { name: 'Pound',     symbol: 'lb',    factor: 0.45359237 },
            oz:    { name: 'Ounce',     symbol: 'oz',    factor: 0.0283495231 },
            stone: { name: 'Stone',     symbol: 'st',    factor: 6.35029 }
        }
    },
    temperature: {
        label: 'Temperature', icon: 'fa-temperature-half', base: 'c',
        units: {
            c: { name: 'Celsius',    symbol: '°C' },
            f: { name: 'Fahrenheit', symbol: '°F' },
            k: { name: 'Kelvin',     symbol: 'K' }
        }
    },
    volume: {
        label: 'Volume', icon: 'fa-flask', base: 'l',
        units: {
            l:    { name: 'Liter',       symbol: 'L',    factor: 1 },
            ml:   { name: 'Milliliter',  symbol: 'mL',   factor: 0.001 },
            m3:   { name: 'Cubic Meter', symbol: 'm³',   factor: 1000 },
            gal:  { name: 'US Gallon',   symbol: 'gal',  factor: 3.785411784 },
            qt:   { name: 'US Quart',    symbol: 'qt',   factor: 0.946352946 },
            pt:   { name: 'US Pint',     symbol: 'pt',   factor: 0.473176473 },
            cup:  { name: 'Cup',         symbol: 'cup',  factor: 0.2365882365 },
            floz: { name: 'Fluid Ounce', symbol: 'fl oz',factor: 0.0295735296 }
        }
    },
    area: {
        label: 'Area', icon: 'fa-vector-square', base: 'm2',
        units: {
            m2:   { name: 'Square Meter',      symbol: 'm²',   factor: 1 },
            km2:  { name: 'Square Kilometer',  symbol: 'km²',  factor: 1000000 },
            cm2:  { name: 'Square Centimeter', symbol: 'cm²',  factor: 0.0001 },
            ha:   { name: 'Hectare',           symbol: 'ha',   factor: 10000 },
            acre: { name: 'Acre',              symbol: 'ac',   factor: 4046.8564224 },
            mi2:  { name: 'Square Mile',       symbol: 'mi²',  factor: 2589988.110336 },
            ft2:  { name: 'Square Foot',       symbol: 'ft²',  factor: 0.09290304 },
            yd2:  { name: 'Square Yard',       symbol: 'yd²',  factor: 0.83612736 }
        }
    },
    speed: {
        label: 'Speed', icon: 'fa-gauge-high', base: 'mps',
        units: {
            mps:  { name: 'Meters/Second',   symbol: 'm/s',  factor: 1 },
            kmph: { name: 'Kilometers/Hour', symbol: 'km/h', factor: 0.2777777778 },
            mph:  { name: 'Miles/Hour',      symbol: 'mph',  factor: 0.44704 },
            knot: { name: 'Knot',            symbol: 'kn',   factor: 0.5144444444 },
            fps:  { name: 'Feet/Second',     symbol: 'ft/s', factor: 0.3048 }
        }
    },
    time: {
        label: 'Time', icon: 'fa-clock', base: 's',
        units: {
            ms:   { name: 'Millisecond', symbol: 'ms',   factor: 0.001 },
            s:    { name: 'Second',      symbol: 's',    factor: 1 },
            min:  { name: 'Minute',      symbol: 'min',  factor: 60 },
            hr:   { name: 'Hour',        symbol: 'hr',   factor: 3600 },
            day:  { name: 'Day',         symbol: 'day',  factor: 86400 },
            week: { name: 'Week',        symbol: 'wk',   factor: 604800 },
            year: { name: 'Year',        symbol: 'yr',   factor: 31536000 }
        }
    },
    data: {
        label: 'Data', icon: 'fa-database', base: 'b',
        units: {
            bit: { name: 'Bit',      symbol: 'bit', factor: 0.125 },
            b:   { name: 'Byte',     symbol: 'B',   factor: 1 },
            kb:  { name: 'Kilobyte', symbol: 'KB',  factor: 1024 },
            mb:  { name: 'Megabyte', symbol: 'MB',  factor: 1048576 },
            gb:  { name: 'Gigabyte', symbol: 'GB',  factor: 1073741824 },
            tb:  { name: 'Terabyte', symbol: 'TB',  factor: 1099511627776 }
        }
    },
    pressure: {
        label: 'Pressure', icon: 'fa-gauge', base: 'pa',
        units: {
            pa:   { name: 'Pascal',      symbol: 'Pa',  factor: 1 },
            kpa:  { name: 'Kilopascal',  symbol: 'kPa', factor: 1000 },
            bar:  { name: 'Bar',         symbol: 'bar', factor: 100000 },
            atm:  { name: 'Atmosphere',  symbol: 'atm', factor: 101325 },
            psi:  { name: 'PSI',         symbol: 'psi', factor: 6894.757293168 },
            mmhg: { name: 'mmHg',        symbol: 'mmHg',factor: 133.322387415 }
        }
    }
};

const DEFAULT_PAIR = {
    length: ['m', 'ft'], weight: ['kg', 'lb'], temperature: ['c', 'f'],
    volume: ['l', 'gal'], area: ['m2', 'ft2'], speed: ['kmph', 'mph'],
    time: ['min', 'hr'], data: ['mb', 'gb'], pressure: ['bar', 'psi']
};

const categoryScroll = document.getElementById('categoryScroll');
const amountInput = document.getElementById('amountInput');
const convertedOutput = document.getElementById('convertedOutput');
const amountUnit = document.getElementById('amountUnit');
const fromIcon = document.getElementById('fromIcon');
const toIcon = document.getElementById('toIcon');
const swapBtn = document.getElementById('swapBtn');
const rateNote = document.getElementById('rateNote');
const rateOutput = document.getElementById('rateOutput');
const rateBox = document.getElementById('rateBox');
const convertedBox = document.getElementById('convertedBox');
const clearBtn = document.getElementById('clear');
const calculateBtn = document.getElementById('calculate');
const amountDiv = document.getElementById('amountDiv');

const fromWrap = document.getElementById('fromWrap');
const fromTrigger = document.getElementById('fromTrigger');
const fromLabel = document.getElementById('fromLabel');
const fromDropdown = document.getElementById('fromDropdown');

const toWrap = document.getElementById('toWrap');
const toTrigger = document.getElementById('toTrigger');
const toLabel = document.getElementById('toLabel');
const toDropdown = document.getElementById('toDropdown');

let currentCategory = 'length';
let fromValue = DEFAULT_PAIR.length[0];
let toValue = DEFAULT_PAIR.length[1];
let debounceTimer = null;

function closeAllDropdowns() {
    fromWrap.classList.remove('open');
    toWrap.classList.remove('open');
    fromTrigger.setAttribute('aria-expanded', 'false');
    toTrigger.setAttribute('aria-expanded', 'false');
}

function toggleDropdown(wrap, trigger) {
    const isOpen = wrap.classList.contains('open');
    closeAllDropdowns();
    if (!isOpen) {
        wrap.classList.add('open');
        trigger.setAttribute('aria-expanded', 'true');
    }
}

function markActive(listEl, code) {
    listEl.querySelectorAll('.unit-option').forEach(li => {
        li.classList.toggle('active', li.dataset.code === code);
    });
}

function buildDropdown(listEl, units, onSelect, selectedValue) {
    listEl.innerHTML = '';
    Object.keys(units).forEach((code) => {
        const li = document.createElement('li');
        li.className = 'unit-option' + (code === selectedValue ? ' active' : '');
        li.setAttribute('role', 'option');
        li.dataset.code = code;

        const symbolSpan = document.createElement('span');
        symbolSpan.className = 'option-symbol';
        symbolSpan.textContent = units[code].symbol;

        const nameSpan = document.createElement('span');
        nameSpan.className = 'option-name';
        nameSpan.textContent = units[code].name;

        li.append(symbolSpan, nameSpan);
        li.addEventListener('click', () => onSelect(code));
        listEl.appendChild(li);
    });
}

function selectFrom(code) {
    fromValue = code;
    const unit = CATEGORIES[currentCategory].units[code];
    fromLabel.textContent = unit.name;
    amountUnit.textContent = unit.symbol;
    markActive(fromDropdown, code);
    closeAllDropdowns();
    convert();
}

function selectTo(code) {
    toValue = code;
    const unit = CATEGORIES[currentCategory].units[code];
    toLabel.textContent = unit.name;
    markActive(toDropdown, code);
    closeAllDropdowns();
    convert();
}

function renderCategoryChips() {
    categoryScroll.innerHTML = '';
    Object.keys(CATEGORIES).forEach((key) => {
        const cat = CATEGORIES[key];
        const chip = document.createElement('div');
        chip.className = 'category-chip' + (key === currentCategory ? ' active' : '');
        chip.setAttribute('role', 'tab');
        chip.dataset.key = key;
        chip.innerHTML = `<i class="fa-solid ${cat.icon}"></i><span>${cat.label}</span>`;
        chip.addEventListener('click', () => switchCategory(key));
        categoryScroll.appendChild(chip);
    });
}

function switchCategory(key) {
    if (key === currentCategory) return;
    currentCategory = key;
    const [defFrom, defTo] = DEFAULT_PAIR[key];
    fromValue = defFrom;
    toValue = defTo;

    categoryScroll.querySelectorAll('.category-chip').forEach(chip => {
        chip.classList.toggle('active', chip.dataset.key === key);
    });

    loadCategoryUnits();
}

function loadCategoryUnits() {
    const cat = CATEGORIES[currentCategory];
    fromIcon.className = `fa-solid ${cat.icon} unit-icon`;
    toIcon.className = `fa-solid ${cat.icon} unit-icon`;

    buildDropdown(fromDropdown, cat.units, selectFrom, fromValue);
    buildDropdown(toDropdown, cat.units, selectTo, toValue);

    fromLabel.textContent = cat.units[fromValue].name;
    toLabel.textContent = cat.units[toValue].name;
    amountUnit.textContent = cat.units[fromValue].symbol;

    convert();
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

function toCelsius(value, from) {
    if (from === 'c') return value;
    if (from === 'f') return (value - 32) * 5 / 9;
    if (from === 'k') return value - 273.15;
}
function fromCelsius(value, to) {
    if (to === 'c') return value;
    if (to === 'f') return (value * 9 / 5) + 32;
    if (to === 'k') return value + 273.15;
}

function convertValue(amount, category, from, to) {
    if (category === 'temperature') {
        return fromCelsius(toCelsius(amount, from), to);
    }
    const cat = CATEGORIES[category];
    const baseAmount = amount * cat.units[from].factor;
    return baseAmount / cat.units[to].factor;
}

function formatNumber(n) {
    if (!isFinite(n)) return '--';
    const abs = Math.abs(n);
    const digits = abs !== 0 && abs < 1 ? 6 : (abs < 100 ? 4 : 2);
    return n.toLocaleString(undefined, {
        minimumFractionDigits: 0,
        maximumFractionDigits: digits
    });
}

function convert() {
    const amount = parseFloat(amountInput.value);

    if (isNaN(amount)) {
        shakeField();
        return;
    }

    const cat = CATEGORIES[currentCategory];
    const fromUnit = cat.units[fromValue];
    const toUnit = cat.units[toValue];

    const result = convertValue(amount, currentCategory, fromValue, toValue);
    convertedOutput.textContent = `${formatNumber(result)} ${toUnit.symbol}`;

    if (currentCategory === 'temperature') {
        const sample = convertValue(1, currentCategory, fromValue, toValue);
        rateOutput.textContent = `1 ${fromUnit.symbol} = ${formatNumber(sample)} ${toUnit.symbol}`;
        rateNote.textContent = `Converting ${fromUnit.name} to ${toUnit.name}`;
    } else {
        const oneUnit = convertValue(1, currentCategory, fromValue, toValue);
        rateOutput.textContent = `1 ${fromUnit.symbol} = ${formatNumber(oneUnit)} ${toUnit.symbol}`;
        rateNote.textContent = `${cat.label} · ${fromUnit.name} to ${toUnit.name}`;
    }

    flashResult();
}

function clearAll() {
    amountInput.value = '';
    convertedOutput.textContent = '0';
}

// ----- Events -----
amountInput.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(convert, 200);
});

fromTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(fromWrap, fromTrigger);
});
toTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleDropdown(toWrap, toTrigger);
});

document.addEventListener('click', (e) => {
    if (!fromWrap.contains(e.target) && !toWrap.contains(e.target)) {
        closeAllDropdowns();
    }
});
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllDropdowns();
});

swapBtn.addEventListener('click', () => {
    swapBtn.classList.add('spin');
    setTimeout(() => swapBtn.classList.remove('spin'), 350);

    const temp = fromValue;
    selectFrom(toValue);
    selectTo(temp);
});

calculateBtn.addEventListener('click', convert);
clearBtn.addEventListener('click', clearAll);

// ----- Init -----
renderCategoryChips();
loadCategoryUnits();