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

// ===== Tab switching =====
const tabButtons = document.querySelectorAll('.tab-btn');
const panels = document.querySelectorAll('.panel');
const formulaNote = document.getElementById('formulaNote');

const formulaText = {
    cgpaToPercent: 'Formula Used : Percentage = CGPA × 9.5',
    percentToCgpa: 'Formula Used : CGPA = Percentage ÷ 9.5',
    marksCalc: 'Percentage = (Scored ÷ Full) × 100, then CGPA = Percentage ÷ 9.5'
};

let activeTab = 'cgpaToPercent';

const resultGrid = document.getElementById('resultGrid');
const percentBox = document.getElementById('percentBox');
const cgpaBox = document.getElementById('cgpaBox');

function updateResultVisibility(tab) {
    if (tab === 'cgpaToPercent') {
        percentBox.classList.remove('hidden');
        cgpaBox.classList.add('hidden');
        resultGrid.classList.add('single');
    } else if (tab === 'percentToCgpa') {
        cgpaBox.classList.remove('hidden');
        percentBox.classList.add('hidden');
        resultGrid.classList.add('single');
    } else {
        percentBox.classList.remove('hidden');
        cgpaBox.classList.remove('hidden');
        resultGrid.classList.remove('single');
    }
}

tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        tabButtons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));

        btn.classList.add('active');
        activeTab = btn.dataset.tab;
        document.getElementById('panel-' + activeTab).classList.add('active');
        formulaNote.textContent = formulaText[activeTab];
        updateResultVisibility(activeTab);
    });
});

updateResultVisibility(activeTab);

// ===== Calculator =====
const cgpaInput = document.getElementById('cgpaInput');
const percentInput = document.getElementById('percentInput');
const fullMarks = document.getElementById('fullMarks');
const scoredMarks = document.getElementById('scoredMarks');

const percentOutput = document.getElementById('percentOutput');
const cgpaOutput = document.getElementById('cgpaOutput');

const clearBtn = document.getElementById('clear');
const calculateBtn = document.getElementById('calculate');

const CGPA_MULTIPLIER = 9.5; // standard CBSE-style conversion factor

function shakeField(el) {
    el.classList.add('shake');
    setTimeout(() => el.classList.remove('shake'), 400);
}

function flashResult() {
    document.querySelectorAll('.result .price-box').forEach(box => {
        box.classList.add('flash');
        setTimeout(() => box.classList.remove('flash'), 450);
    });
}

function setResults(percentage, cgpa) {
    percentOutput.innerHTML = `${percentage.toFixed(2)}<span class="unit">%</span>`;
    cgpaOutput.textContent = cgpa.toFixed(2);
    flashResult();
}

function calculate() {
    if (activeTab === 'cgpaToPercent') {
        const cgpa = parseFloat(cgpaInput.value);
        if (isNaN(cgpa) || cgpa < 0 || cgpa > 10) {
            shakeField(cgpaInput);
            return;
        }
        const percentage = cgpa * CGPA_MULTIPLIER;
        setResults(percentage, cgpa);

    } else if (activeTab === 'percentToCgpa') {
        const percentage = parseFloat(percentInput.value);
        if (isNaN(percentage) || percentage < 0 || percentage > 100) {
            shakeField(percentInput);
            return;
        }
        const cgpa = percentage / CGPA_MULTIPLIER;
        setResults(percentage, cgpa);

    } else if (activeTab === 'marksCalc') {
        const full = parseFloat(fullMarks.value);
        const scored = parseFloat(scoredMarks.value);

        if (isNaN(full) || full <= 0) {
            shakeField(fullMarks);
            return;
        }
        if (isNaN(scored) || scored < 0 || scored > full) {
            shakeField(scoredMarks);
            return;
        }

        const percentage = (scored / full) * 100;
        const cgpa = percentage / CGPA_MULTIPLIER;
        setResults(percentage, cgpa);
    }
}

function clearAll() {
    cgpaInput.value = '';
    percentInput.value = '';
    fullMarks.value = '';
    scoredMarks.value = '';
    percentOutput.innerHTML = '0.00<span class="unit">%</span>';
    cgpaOutput.textContent = '0.00';
}

calculateBtn.addEventListener('click', calculate);
clearBtn.addEventListener('click', clearAll);