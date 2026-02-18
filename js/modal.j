/* ════════════════════════════════
   BRINGO — МОДАЛКА ТОВАРУ
   Залежності: data.js, nav.js, cart.js
════════════════════════════════ */

let mItem = null;
let mQty  = 1;
let mSel  = {};

/* ── Відкрити модалку товару ── */ 
function openModal(item) {
  mItem = item;
  mQty  = 1;
  mSel  = {};

  // Ініціалізація вибору: radio → 0, check → порожній Set
  item.groups.forEach((g, gi) => {
    mSel[gi] = g.type === 'radio' ? 0 : new Set();
  });

  document.getElementById('mImg').style.backgroundImage = `url('${item.img}')`;
  document.getElementById('mName').textContent          = item.n;
  document.getElementById('mDesc').textContent          = item.d;
  document.getElementById('mQtyEl').textContent         = 1;

  renderGroups();
  updTotal();

  document.getElementById('mOv').classList.add('on');
}

/* ── Закрити модалку ── */
function closeModal() {
  document.getElementById('mOv').classList.remove('on');
}

/* ── Відрендерити групи опцій ── */
function renderGroups() {
  document.getElementById('mGroups').innerHTML = mItem.groups.map((g, gi) => `
    <div class="grp">
      <div class="grp-label">${g.label}</div>
      <div class="grp-sub">${g.sub}</div>
      ${g.options.map((o, oi) => {
        if (g.type === 'radio') {
          const on       = mSel[gi] === oi ? 'on' : '';
          const priceStr = g.isFull
            ? o.p + ' грн'
            : (oi === 0 ? mItem.basePrice + ' грн' : '+' + o.p + ' грн');
          return `
            <div class="row ${on}" onclick="pickRadio(${gi}, ${oi})">
              <div class="radio"><div class="radio-dot"></div></div>
              <span class="row-label">${o.n}</span>
              <span class="row-price">${priceStr}</span>
            </div>`;
        } else {
          const on = mSel[gi].has(oi) ? 'on' : '';
          return `
            <div class="crow ${on}" onclick="pickCheck(${gi}, ${oi}, ${g.max || 99})">
              <div class="chk">${mSel[gi].has(oi) ? '✓' : ''}</div>
              <span class="crow-label">${o.n}</span>
              <span class="crow-price">+${o.p} грн</span>
            </div>`;
        }
      }).join('')}
    </div>`
  ).join('');
}

/* ── Вибір radio-опції ── */
function pickRadio(gi, oi) {
  mSel[gi] = oi;
  const rows = document.querySelectorAll('.grp')[gi].querySelectorAll('.row');
  rows.forEach((r, i) => {
    r.classList.toggle('on', i === oi);
    r.querySelector('.radio-dot').style.opacity = i === oi ? '1' : '0';
  });
  updTotal();
}

/* ── Вибір checkbox-опції ── */
function pickCheck(gi, oi, max) {
  const s = mSel[gi];
  if (s.has(oi)) {
    s.delete(oi);
  } else {
    if (s.size >= max) { showToast('Максимум ' + max + ' варіантів'); return; }
    s.add(oi);
  }
  const rows = document.querySelectorAll('.grp')[gi].querySelectorAll('.crow');
  rows.forEach((r, i) => {
    r.classList.toggle('on', s.has(i));
    r.querySelector('.chk').textContent = s.has(i) ? '✓' : '';
  });
  updTotal();
}

/* ── Розрахунок ціни ── */
function calcPrice() {
  let total = mItem.basePrice;
  mItem.groups.forEach((g, gi) => {
    if (g.type === 'radio') {
      total = g.isFull
        ? g.options[mSel[gi]].p
        : total + (g.options[mSel[gi]]?.p || 0);
    } else {
      mSel[gi].forEach(oi => total += g.options[oi].p);
    }
  });
  return total * mQty;
}

/* ── Оновити суму в кнопці ── */
function updTotal() {
  document.getElementById('mTotal').textContent = calcPrice() + ' грн';
}

/* ── Змінити кількість ── */
function chQty(d) {
  mQty = Math.max(1, mQty + d);
  document.getElementById('mQtyEl').textContent = mQty;
  updTotal();
}

/* ── Додати в кошик ── */
function addCart() {
  const unitPrice = calcPrice() / mQty;
  const optLines  = [];

  mItem.groups.forEach((g, gi) => {
    if (g.type === 'radio') {
      optLines.push(g.options[mSel[gi]].n);
    } else {
      mSel[gi].forEach(oi => optLines.push(g.options[oi].n));
    }
  });

  cart.push({ item: mItem, opts: optLines, unitPrice, qty: mQty });

  updateCartBadge();
  closeModal();
  showToast('✅ ' + mItem.n + ' · ' + optLines[0]);
}
