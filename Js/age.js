  const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS_LONG = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  let mode = 'today';
  let popupShown = false;

  const bdayWishes = [
    "May your day be as bright as your smile and as special as you are! 🌟",
    "Wishing you endless laughter, good health, and beautiful moments today! ✨",
    "Another year wiser, another year more amazing. Have a fantastic birthday! 🥳",
    "May all your dreams come true on this special day. You deserve the best! 🌈",
    "Here's to you and all the joy you bring to everyone around you. Happy Birthday! 🎊"
  ];

  const advanceWishes = [
    { icon:"🎁", title:"Birthday Coming Soon!",  text:"Get ready to celebrate! Your special day is almost here. Wishing you a magical birthday in advance! 🌟" },
    { icon:"🎀", title:"Advance Happy Birthday!", text:"Can't wait for your big day! May it be filled with happiness, surprises, and all things wonderful! ✨" },
    { icon:"🥳", title:"Birthday Countdown!",     text:"The celebrations are about to begin! Wishing you an amazing birthday in advance — you deserve it all! 🎉" },
    { icon:"🌟", title:"Almost Your Day!",        text:"Just a few more days until your special day! Sending warm wishes and love your way in advance! 💛" },
    { icon:"🎊", title:"Advance Wishes!",         text:"Your birthday is right around the corner! Hope it brings you everything you've been wishing for! 🎂" }
  ];

  /* ── Input helpers ── */

  // Auto-advance to next field when enough digits typed; clamp value
  function handleSeg(el, nextId, prevId, maxLen) {
    // Strip non-numeric
    el.value = el.value.replace(/\D/g,'');
    if (el.value.length > maxLen) el.value = el.value.slice(0, maxLen);

    // Clamp
    const v = parseInt(el.value);
    if (!isNaN(v)) {
      if (el.max && v > parseInt(el.max)) el.value = el.max;
      if (el.min && v < 1 && el.value.length === maxLen) el.value = el.min;
    }

    // Auto-advance
    if (el.value.length === maxLen && nextId) {
      document.getElementById(nextId).focus();
    }

    tryCalculate();
  }

  // Pad single-digit day/month on blur (e.g. 5 → 05)
  function padSeg(el) {
    const v = parseInt(el.value);
    if (!isNaN(v) && el.value.length === 1) el.value = String(v).padStart(2, '0');
  }

  // Open hidden native date picker via calendar icon
  function openPicker(pickerId) {
    const p = document.getElementById(pickerId);
    p.style.pointerEvents = 'auto';
    p.style.zIndex = '10';
    p.showPicker ? p.showPicker() : p.click();
    setTimeout(() => { p.style.pointerEvents = 'none'; p.style.zIndex = '-1'; }, 300);
  }

  // When native picker changes, fill the split fields
  function pickerChanged(picker, prefix) {
    if (!picker.value) return;
    const [y, m, d] = picker.value.split('-');
    document.getElementById(prefix+'-dd').value   = d;
    document.getElementById(prefix+'-mm').value   = m;
    document.getElementById(prefix+'-yyyy').value = y;
    tryCalculate();
  }

  // Read split fields into a Date; returns null if incomplete/invalid
  function readDate(prefix) {
    const dd   = parseInt(document.getElementById(prefix+'-dd').value);
    const mm   = parseInt(document.getElementById(prefix+'-mm').value);
    const yyyy = parseInt(document.getElementById(prefix+'-yyyy').value);
    if (!dd || !mm || !yyyy) return null;
    if (yyyy < 1000 || yyyy > 2099) return null;
    if (mm < 1 || mm > 12) return null;
    if (dd < 1 || dd > 31) return null;
    const d = new Date(yyyy, mm - 1, dd);
    // Check date is real (e.g. Feb 30 wraps)
    if (d.getDate() !== dd || d.getMonth() !== mm - 1) return null;
    return d;
  }

  function tryCalculate() { calculate(); }

  function switchTab(tab) {
    mode = tab;
    document.getElementById('tab-today').classList.toggle('active', tab === 'today');
    document.getElementById('tab-specific').classList.toggle('active', tab === 'specific');
    document.getElementById('asof-wrap').style.display = tab === 'specific' ? 'block' : 'none';
    document.body.classList.toggle('specific', tab === 'specific');
    popupShown = false;
    calculate();
  }

  function fmt(n) { return String(n).padStart(2, '0'); }
  function fmtLarge(n) { return n.toLocaleString('en-IN'); }

  function calculate() {
    const dob = readDate('dob');
    if (!dob) return resetDisplay();

    let refDate;
    if (mode === 'specific') {
      refDate = readDate('asof');
      if (!refDate) return resetDisplay();
      const am = refDate.getMonth(), ad = refDate.getDate(), ay = refDate.getFullYear();
      document.getElementById('result-title').textContent =
        `Age as of ${MONTHS_LONG[am].slice(0,3)} ${ad}, ${ay}`;
    } else {
      refDate = new Date();
      document.getElementById('result-title').textContent = 'Your Current Age';
    }

    if (dob > refDate) return resetDisplay();

    let years  = refDate.getFullYear() - dob.getFullYear();
    let months = refDate.getMonth()    - dob.getMonth();
    let days   = refDate.getDate()     - dob.getDate();

    if (days < 0) {
      months--;
      days += new Date(refDate.getFullYear(), refDate.getMonth(), 0).getDate();
    }
    if (months < 0) { years--; months += 12; }

    document.getElementById('age-display').textContent =
      `${fmt(years)} Years, ${fmt(months)} Months, ${fmt(days)} Days`;
    document.getElementById('born-day').textContent = `Born on a ${DAYS[dob.getDay()]}`;

    const totalDays = Math.floor((refDate - dob) / 86400000);
    document.getElementById('total-days').textContent   = fmtLarge(totalDays);
    document.getElementById('total-weeks').textContent  = fmtLarge(Math.floor(totalDays / 7));
    document.getElementById('total-months').textContent = fmtLarge(years * 12 + months);
    document.getElementById('total-hours').textContent  = fmtLarge(totalDays * 24);

    if (mode === 'today') {
      const now    = new Date();
      // Use date-only comparison (strip time) to avoid midnight/timezone issues
      const todayY = now.getFullYear(), todayM = now.getMonth(), todayD = now.getDate();
      const todayDate = new Date(todayY, todayM, todayD);

      const isBirthdayToday = (dob.getMonth() === todayM && dob.getDate() === todayD);

      // Next birthday: this year if not yet passed (date-only), else next year
      let nextBdayYear = todayY;
      const bdayThisYear = new Date(todayY, dob.getMonth(), dob.getDate());
      if (!isBirthdayToday && bdayThisYear < todayDate) nextBdayYear = todayY + 1;
      const nextBday = new Date(nextBdayYear, dob.getMonth(), dob.getDate());

      // Days to go: pure date difference, no time involved
      const daysToGo   = isBirthdayToday ? 0 : Math.round((nextBday - todayDate) / 86400000);
      const turningAge = nextBdayYear - dob.getFullYear();

      document.getElementById('bday-banner-label').textContent =
        isBirthdayToday ? "🎂 Today's Birthday!" : "Next Birthday";
      document.getElementById('next-bday').textContent =
        `${DAYS[nextBday.getDay()]}, ${MONTHS_LONG[nextBday.getMonth()]} ${nextBday.getDate()}, ${nextBday.getFullYear()}`;
      document.getElementById('days-to-go').textContent =
        isBirthdayToday ? '🎉 Today!' : `${daysToGo} day${daysToGo===1?'':'s'} to go`;
      document.getElementById('turning-age').textContent = `Turning ${turningAge}`;

      const advWish = document.getElementById('advance-wish');
      if (!isBirthdayToday && daysToGo >= 1 && daysToGo <= 30) {
        // Pick wish based on how close: 1 day, 2-3 days, 4-7 days, 8-30 days
        let pickIdx = daysToGo === 1 ? 0 : daysToGo <= 3 ? 1 : daysToGo <= 7 ? 2 : 3;
        const pick = advanceWishes[pickIdx];
        document.getElementById('wish-icon').textContent  = pick.icon;
        document.getElementById('wish-title').textContent = pick.title;
        let wishPrefix = daysToGo === 1
          ? 'Tomorrow is your birthday! 🎉 '
          : daysToGo <= 7
          ? `Only ${daysToGo} days to go! `
          : `${daysToGo} days until your birthday! `;
        document.getElementById('wish-text').textContent = wishPrefix + pick.text;
        advWish.classList.add('show');
      } else {
        advWish.classList.remove('show');
      }

      if (isBirthdayToday && !popupShown) {
        popupShown = true;
        const wish = bdayWishes[Math.floor(Math.random() * bdayWishes.length)];
        document.getElementById('popup-title').textContent = '🎂 Happy Birthday!';
        document.getElementById('popup-age').textContent   = `You're turning ${turningAge} today 🎊`;
        document.getElementById('popup-msg').textContent   = wish;
        setTimeout(() => document.getElementById('bday-popup').classList.add('show'), 400);
      }
    }
  }

  function closePopup() {
    document.getElementById('bday-popup').classList.remove('show');
  }

  function resetDisplay() {
    document.getElementById('age-display').textContent = '00 Years, 00 Months, 00 Days';
    document.getElementById('born-day').textContent    = 'Born on a —';
    ['total-days','total-weeks','total-months','total-hours'].forEach(id => {
      document.getElementById(id).textContent = '0';
    });
    document.getElementById('next-bday').textContent          = '—';
    document.getElementById('days-to-go').textContent         = '— days to go';
    document.getElementById('turning-age').textContent        = 'Turning —';
    document.getElementById('result-title').textContent       = 'Your Current Age';
    document.getElementById('bday-banner-label').textContent  = 'Next Birthday';
    document.getElementById('advance-wish').classList.remove('show');
    popupShown = false;
  }