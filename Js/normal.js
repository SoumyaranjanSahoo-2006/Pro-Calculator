const lineTop = document.getElementById('lineTop');
const lineBottom = document.getElementById('lineBottom');
const cursor = document.getElementById('cursor');

let expression = '';   // what's being typed
let showingResult = false;

function isOperator(ch) {
  return ['+', '-', '*', '/', '%'].includes(ch);
}

function render() {
  if (showingResult) {
    // result mode: result is big and on top, expression small on bottom
    lineTop.textContent = lineBottom.dataset.result;
    lineTop.className = 'line large';
    lineBottom.textContent = expression || '0';
    lineBottom.className = 'line small';
  } else {
    // typing mode: expression is big and on bottom, top stays small/empty
    lineTop.textContent = '';
    lineTop.className = 'line small';
    lineBottom.textContent = expression || '0';
    lineBottom.className = 'line large';
  }
}

function getCurrentSegment() {
  // returns the number segment currently being typed (after the last operator/bracket)
  const match = expression.match(/[0-9.]*$/);
  return match ? match[0] : '';
}

function appendValue(val) {
  if (showingResult) {
    if (isOperator(val)) {
      expression = lineTop.textContent + val;
    } else {
      expression = val === '.' ? '0.' : val;
    }
    showingResult = false;
    render();
    return;
  }

  if (val === '.') {
    const segment = getCurrentSegment();
    if (segment.includes('.')) return; // block second dot in same number
    if (segment === '') expression += '0'; // "." at start becomes "0."
    expression += '.';
    render();
    return;
  }

  const last = expression.slice(-1);
  if (isOperator(val) && isOperator(last)) {
    expression = expression.slice(0, -1) + val; // replace last operator
  } else {
    expression += val;
  }
  render();
}

function appendBracket() {
  if (showingResult) {
    expression = '(';
    showingResult = false;
    render();
    return;
  }

  const openCount = (expression.match(/\(/g) || []).length;
  const closeCount = (expression.match(/\)/g) || []).length;
  const hasUnclosed = openCount > closeCount;

  const last = expression.slice(-1);
  const canClose = hasUnclosed && last !== '(' && !isOperator(last);

  if (canClose) {
    expression += ')';
  } else if (/[0-9)]/.test(last)) {
    expression += '*('; // implicit multiplication
  } else {
    expression += '(';
  }
  render();
}

function clearAll() {
  expression = '';
  showingResult = false;
  render();
}

function deleteLast() {
  if (showingResult) {
    clearAll();
    return;
  }
  expression = expression.slice(0, -1);
  render();
}

function calculate() {
  if (!expression) return;
  try {
    const sanitized = expression.replace(/%/g, '/100');
    if (!/^[0-9+\-*/.() ]*$/.test(sanitized)) throw new Error('bad expr');
    const result = Function('"use strict"; return (' + sanitized + ')')();
    if (result === undefined || Number.isNaN(result) || !Number.isFinite(result)) {
      throw new Error('invalid');
    }
    const rounded = Math.round(result * 1e10) / 1e10;
    lineBottom.dataset.result = rounded.toString();
    showingResult = true;
    render();
  } catch (e) {
    lineBottom.dataset.result = 'Error';
    showingResult = true;
    render();
  }
}

// wire up buttons
document.querySelectorAll('.digit, .operation').forEach(btn => {
  if (['cleare', 'delete', 'equal', 'bracket'].includes(btn.id)) return;
  btn.addEventListener('click', () => appendValue(btn.dataset.value));
});

document.getElementById('cleare').addEventListener('click', clearAll);
document.getElementById('delete').addEventListener('click', deleteLast);
document.getElementById('equal').addEventListener('click', calculate);
document.getElementById('bracket').addEventListener('click', appendBracket);

render();




function render() {
  if (showingResult) {
    lineTop.textContent = lineBottom.dataset.result;
    lineTop.className = 'line large';
    lineBottom.textContent = expression || '0';
    lineBottom.className = 'line small';
    cursor.classList.add('hidden');
  } else {
    lineTop.textContent = '';
    lineTop.className = 'line small';
    lineBottom.textContent = expression || '0';
    lineBottom.className = 'line large';
    cursor.classList.remove('hidden');
  }
}