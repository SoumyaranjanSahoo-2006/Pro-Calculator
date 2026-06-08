let expr = '';
  let justEvaled = false;
 
  const exprEl   = document.getElementById('exprText');
  const resultEl = document.getElementById('result');
 
  function updateDisplay() {
    exprEl.textContent = expr === '' ? '0' : expr;
    // live preview
    if (expr !== '') {
      try {
        const preview = safeEval(expr);
        if (preview !== null && String(preview) !== expr) {
          resultEl.textContent = format(preview);
        } else {
          resultEl.textContent = '';
        }
      } catch { resultEl.textContent = ''; }
    } else {
      resultEl.textContent = '';
    }
  }
 
  function safeEval(e) {
    // replace display chars with JS operators
    let s = e
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-');
    // handle %: treat as /100 after a number
    s = s.replace(/(\d+(\.\d+)?)%/g, '($1/100)');
    // handle parentheses auto-close
    const open  = (s.match(/\(/g) || []).length;
    const close = (s.match(/\)/g) || []).length;
    if (open > close) s += ')'.repeat(open - close);
    try {
      // eslint-disable-next-line no-new-func
      const r = Function('"use strict"; return (' + s + ')')();
      if (!isFinite(r)) return null;
      return r;
    } catch { return null; }
  }
 
  function format(n) {
    if (n === null || n === undefined) return '';
    const s = parseFloat(n.toFixed(10)).toString();
    return s;
  }
 
  function pressBtn(val) {
    if (justEvaled && /[\d.(]/.test(val)) {
      expr = ''; // start fresh after = if typing a number
    }
    justEvaled = false;
 
    if (val === '⌫') {
      expr = expr.slice(0, -1);
    } else if (val === '()') {
      // smart bracket: open if last char is operator/empty, else close
      const last = expr.slice(-1);
      const open  = (expr.match(/\(/g) || []).length;
      const close = (expr.match(/\)/g) || []).length;
      if (expr === '' || /[+\-×÷/(]/.test(last)) {
        expr += '(';
      } else if (open > close) {
        expr += ')';
      } else {
        expr += '×(';
      }
    } else if (val === '%') {
      expr += '%';
    } else {
      // prevent double operators
      const last = expr.slice(-1);
      const isOp = (c) => /[+\-×÷/]/.test(c);
      if (isOp(val) && isOp(last)) {
        expr = expr.slice(0, -1) + val;
      } else {
        expr += val;
      }
    }
    updateDisplay();
  }
 
  function pressAC() {
    expr = '';
    justEvaled = false;
    resultEl.textContent = '';
    updateDisplay();
  }
 
  function pressEquals() {
    if (expr === '') return;
    const res = safeEval(expr);
    if (res !== null) {
      resultEl.textContent = '';
      expr = format(res);
      exprEl.textContent = expr;
      justEvaled = true;
    } else {
      resultEl.textContent = 'Error';
    }
  }
 
  // Keyboard support
  document.addEventListener('keydown', (e) => {
    const map = {
      '0':'0','1':'1','2':'2','3':'3','4':'4',
      '5':'5','6':'6','7':'7','8':'8','9':'9',
      '+':'+','-':'-','*':'×','/':'÷','%':'%',
      '.':'.','(':' (',')':")'",'Enter':'=','Backspace':'⌫','Escape':'AC'
    };
    if (e.key === 'Enter') { pressEquals(); return; }
    if (e.key === 'Escape') { pressAC(); return; }
    if (e.key === 'Backspace') { pressBtn('⌫'); return; }
    if (map[e.key]) pressBtn(map[e.key]);
  });
 
  updateDisplay();