// Normal Calculator Variables
let currentOperand = '0';
let previousOperand = '';
let operation = null;
let shouldResetScreen = false;

const calculationDisplay = document.getElementById('calculationDisplay');
const resultDisplay = document.getElementById('resultDisplay');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-action]');

// Initialize calculator display
updateDisplay();

// Number buttons
numberButtons.forEach(button => {
    button.addEventListener('click', () => {
        if (button.dataset.number) {
            appendNumber(button.dataset.number);
        } else if (button.dataset.action === 'decimal') {
            addDecimal();
        }
        updateDisplay();
    });
});

// Operator buttons
operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const action = button.dataset.action;
        
        switch(action) {
            case 'add':
            case 'subtract':
            case 'multiply':
            case 'divide':
                chooseOperation(action);
                break;
            case 'equals':
                compute();
                break;
            case 'clear':
                clear();
                break;
            case 'clearEntry':
                clearEntry();
                break;
            case 'percentage':
                percentage();
                break;
            case 'plusMinus':
                plusMinus();
                break;
            case 'backspace':
                backspace();
                break;
            case 'square':
                square();
                break;
            case 'sqrt':
                sqrt();
                break;
        }
        updateDisplay();
    });
});

// Calculator functions
function appendNumber(number) {
    if (currentOperand === '0' || shouldResetScreen) {
        currentOperand = number;
        shouldResetScreen = false;
    } else {
        currentOperand += number;
    }
}

function addDecimal() {
    if (shouldResetScreen) {
        currentOperand = '0.';
        shouldResetScreen = false;
        return;
    }
    
    if (!currentOperand.includes('.')) {
        currentOperand += '.';
    }
}

function chooseOperation(op) {
    if (currentOperand === '') return;
    
    if (previousOperand !== '') {
        compute();
    }
    
    operation = op;
    previousOperand = currentOperand;
    currentOperand = '';
}

function compute() {
    let computation;
    const prev = parseFloat(previousOperand);
    const current = parseFloat(currentOperand);
    
    if (isNaN(prev) || isNaN(current)) return;
    
    switch(operation) {
        case 'add':
            computation = prev + current;
            break;
        case 'subtract':
            computation = prev - current;
            break;
        case 'multiply':
            computation = prev * current;
            break;
        case 'divide':
            if (current === 0) {
                alert("Cannot divide by zero!");
                clear();
                return;
            }
            computation = prev / current;
            break;
        default:
            return;
    }
    
    currentOperand = computation.toString();
    operation = null;
    previousOperand = '';
    shouldResetScreen = true;
}

function clear() {
    currentOperand = '0';
    previousOperand = '';
    operation = null;
}

function clearEntry() {
    currentOperand = '0';
}

function backspace() {
    if (currentOperand.length > 1) {
        currentOperand = currentOperand.slice(0, -1);
    } else {
        currentOperand = '0';
    }
}

function percentage() {
    currentOperand = (parseFloat(currentOperand) / 100).toString();
}

function plusMinus() {
    currentOperand = (parseFloat(currentOperand) * -1).toString();
}

function square() {
    currentOperand = (parseFloat(currentOperand) * parseFloat(currentOperand)).toString();
}

function sqrt() {
    if (parseFloat(currentOperand) < 0) {
        alert("Cannot calculate square root of negative number!");
        return;
    }
    currentOperand = Math.sqrt(parseFloat(currentOperand)).toString();
}

function updateDisplay() {
    resultDisplay.textContent = currentOperand;
    
    if (operation != null) {
        const operatorSymbols = {
            'add': '+',
            'subtract': '−',
            'multiply': '×',
            'divide': '÷'
        };
        calculationDisplay.textContent = `${previousOperand} ${operatorSymbols[operation]}`;
    } else {
        calculationDisplay.textContent = '';
    }
}

// Keyboard support for normal calculator
document.addEventListener('keydown', (e) => {
    if (e.key >= '0' && e.key <= '9') {
        appendNumber(e.key);
        updateDisplay();
    } else if (e.key === '.') {
        addDecimal();
        updateDisplay();
    } else if (e.key === '+' || e.key === '-') {
        chooseOperation(e.key === '+' ? 'add' : 'subtract');
        updateDisplay();
    } else if (e.key === '*' || e.key === 'x') {
        chooseOperation('multiply');
        updateDisplay();
    } else if (e.key === '/') {
        chooseOperation('divide');
        updateDisplay();
    } else if (e.key === 'Enter' || e.key === '=') {
        compute();
        updateDisplay();
    } else if (e.key === 'Escape') {
        clear();
        updateDisplay();
    } else if (e.key === 'Backspace') {
        backspace();
        updateDisplay();
    } else if (e.key === '%') {
        percentage();
        updateDisplay();
    }
});