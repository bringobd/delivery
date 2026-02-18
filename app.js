/* ════════════════════════════════
   BRINGO — app.js
════════════════════════════════ */

/* ── ДАНІ МЕНЮ ── */
const MENU = [
  {
    cat: 'Піца',
    items: [
      {
        n: 'Піца Маестро',
        d: 'Фірмова піца від шефа — соус, сулугуні, моцарела та начинка на ваш вибір',
        img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
        basePrice: 190,
        groups: [
          {
            label: 'Розмір', sub: 'Виберіть 1 варіант', type: 'radio', required: true,
            options: [
              { n: '32 см', p: 0 },
              { n: '50 см', p: 190 },
            ]
          },
          {
            label: 'Додатки', sub: 'Виберіть до 10 варіантів', type: 'check', max: 10,
            options: [
              { n: 'Філе куряче копчене', p: 50 },
              { n: 'Ковбаски до піцці',   p: 30 },
              { n: 'Ковбаса Папероні',    p: 90 },
              { n: 'Помідор',             p: 30 },
              { n: 'Сир піца',            p: 60 },
              { n: 'Сир Голандський',     p: 40 },
              { n: 'Сир Пармезан',        p: 60 },
              { n: 'Ананас конерв.',       p: 30 },
            ]
          },
        ]
      },
    ]
  },
  {
    cat: 'Суші',
    items: [
      {
        n: 'Суші',
        d: 'Свіжі роли та суші від шефа — виберіть що вам до смаку',
        img: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
        basePrice: 250,
        groups: [
          {
            label: 'Суші', sub: 'Виберіть 1 варіант', type: 'radio', required: true,
            isFull: true,
            options: [
              { n: 'New сет',                  p: 700  },
              { n: 'Банзай',                   p: 340  },
              { n: 'Бургер смажений',          p: 310  },
              { n: 'Зелений дракон',           p: 280  },
              { n: 'Каліфорнія',               p: 290  },
              { n: 'Конкура',                  p: 320  },
              { n: 'Самурай',                  p: 320  },
              { n: 'Самрайс',                  p: 450  },
              { n: 'Сімейний сет',             p: 1100 },
              { n: 'Філадельфія сет',          p: 1150 },
              { n: 'Хітоцу сет',               p: 650  },
              { n: 'Хот-дог',                  p: 320  },
              { n: 'Гора Дракона сет',         p: 1350 },
              { n: 'Смажений сет',             p: 850  },
              { n: 'Тигровий дракон',          p: 310  },
              { n: 'Філадельфія з тунцем',     p: 250  },
              { n: 'Філадельфія класична',     p: 250  },
              { n: 'Футомакі',                 p: 270  },
              { n: 'Червоний дракон',          p: 365  },
              { n: 'Чорний дракон',            p: 390  },
              { n: 'Азіатська шаурма краб',    p: 290  },
              { n: 'Смажена з лососем шаурма', p: 290  },
              { n: 'Big maki roll',            p: 270  },
            ]
          },
        ]
      },
    ]
  },
];

/* ════════════════════════════════
   ONBOARDING
════════════════════════════════ */
let user = JSON.parse(localStorage.getItem('bringoUser') || 'null');

function checkOnb() {
  const val = document.getElementById('inpName').value.trim();
  document.getElementById('onbBtn').disabled = !val;
}

function finishOnb() {
  const name    = document.getElementById('inpName').value.trim();
  const surname = document.getElementById('inpSurname').value.trim();
  const phone   = document.getElementById('inpPhone').value.trim();
  user = { name, surname, phone };
  localStorage.setItem('bringoUser', JSON.stringify(user));
  hideOnb();
}

function hideOnb() {
  const el = document.getElementById('onb');
  el.style.transition = 'opacity .3s, transform .3s';
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  setTimeout(() => el.remove(), 320);
  updateProfile();
}

function logout() {
  localStorage.removeItem('bringoUser');
  location.reload();
}

function updateProfile() {
  if (!user) return;
  const full = [user.name, user.surname].filter(Boolean).join(' ');
  document.getElementById('profName').textContent  = full || '—';
  document.getElementById('profPhone').textContent = user.phone
    ? '📞 +38' + user.phone
    : '🏅 Новий клієнт';
}

/* ════════════════════════════════
   НАВІГАЦІЯ
════════════════════════════════ */
let cur    = 'home';
let curCat = MENU[0].cat;

function goPage(id) {
  document.getElementById('pg-' + cur).classList.remove('on');
  document.getElementById('nb-' + cur)?.classList.remove('on');
  cur = id;
  document.getElementById('pg-' + id).classList.add('on');
  document.getElementById('nb-' + id)?.classList.add('on');
  document.getElementById('scr').scrollTop = 0;
  if (id === 'cart') renderCart();
}

function openRest() {
  goPage('rest');
  buildTabs();
  renderCat(curCat);
}

/* ════════════════════════════════
   РЕСТОРАН
════════════════════════════════ */
function buildTabs() {
  document.getElementById('catTabs').innerHTML = MENU.map(({ cat }) =>
    `<div class="ct ${cat === curCat ? 'on' : ''}" onclick="switchCat('${cat}')">${cat}</div>`
  ).join('');
}

function switchCat(cat) {
  curCat = cat;
  document.querySelectorAll('.ct').forEach(t =>
    t.classList.toggle('on', t.textContent === cat)
  );
  renderCat(cat);
  document.getElementById('scr').scrollTop = 0;
}

function renderCat(cat) {
  const { items } = MENU.find(s => s.cat === cat);
  const cards = items.map(item => {
    const d = JSON.stringify(item);
    return `
      <div class="mc" onclick='openModal(${d})'>
        <div class="mc-img" style="background-image:url('${item.img}')"></div>
        <div class="mc-body">
          <div class="mc-name">${item.n}</div>
          <div class="mc-desc">${item.d}</div>
          <div class="mc-foot">
            <div class="mc-price">від ${item.basePrice} грн</div>
            <button class="mc-add" onclick='event.stopPropagation();openModal(${d})'>+</button>
          </div>
        </div>
      </div>`;
  }).join('');
  document.getElementById('menuContent').innerHTML =
    `<div class="msec-title">${cat}</div><div class="mgrid">${cards}</div>`;
}

/* ════════════════════════════════
   МОДАЛКА ТОВАРУ
════════════════════════════════ */
let mItem = null;
let mQty  = 1;
let mSel  = {};

function openModal(item) {
  mItem = item;
  mQty  = 1;
  mSel  = {};
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

function closeModal() {
  document.getElementById('mOv').classList.remove('on');
}

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
            <div class="row ${on}" onclick="pickRadio(${gi},${oi})">
              <div class="radio"><div class="radio-dot"></div></div>
              <span class="row-label">${o.n}</span>
              <span class="row-price">${priceStr}</span>
            </div>`;
        } else {
          const on = mSel[gi].has(oi) ? 'on' : '';
          return `
            <div class="crow ${on}" onclick="pickCheck(${gi},${oi},${g.max || 99})">
              <div class="chk">${mSel[gi].has(oi) ? '✓' : ''}</div>
              <span class="crow-label">${o.n}</span>
              <span class="crow-price">+${o.p} грн</span>
            </div>`;
        }
      }).join('')}
    </div>`
  ).join('');
}

function pickRadio(gi, oi) {
  mSel[gi] = oi;
  const rows = document.querySelectorAll('.grp')[gi].querySelectorAll('.row');
  rows.forEach((r, i) => {
    r.classList.toggle('on', i === oi);
    r.querySelector('.radio-dot').style.opacity = i === oi ? '1' : '0';
  });
  updTotal();
}

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

function updTotal() {
  document.getElementById('mTotal').textContent = calcPrice() + ' грн';
}

function chQty(d) {
  mQty = Math.max(1, mQty + d);
  document.getElementById('mQtyEl').textContent = mQty;
  updTotal();
}

function addCart() {
  const unitPrice = calcPrice() / mQty;
  const optLines  = [];
  mItem.groups.forEach((g, gi) => {
    if (g.type === 'radio') optLines.push(g.options[mSel[gi]].n);
    else mSel[gi].forEach(oi => optLines.push(g.options[oi].n));
  });
  cart.push({ item: mItem, opts: optLines, unitPrice, qty: mQty });
  updateCartBadge();
  closeModal();
  showToast('✅ ' + mItem.n + ' · ' + optLines[0]);
}

/* ════════════════════════════════
   КОШИК
════════════════════════════════ */
let cart = [];

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cartBadge');
  badge.textContent = total || '';
  badge.classList.toggle('on', total > 0);
}

function renderCart() {
  const el = document.getElementById('cartBody');
  document.getElementById('cartClear').style.display = cart.length ? 'block' : 'none';

  if (!cart.length) {
    el.innerHTML = `
      <div class="cart-empty">
        <span>🛒</span>
        <h3>Кошик порожній</h3>
        <p>Додайте страви з меню</p>
        <button class="cta" onclick="openRest()">До меню</button>
      </div>`;
    return;
  }

  const subtotal = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
  const delivery = 50;

  const items = cart.map((c, i) => `
    <div class="ci">
      <div class="ci-img" style="background-image:url('${c.item.img}')"></div>
      <div class="ci-info">
        <div class="ci-name">${c.item.n} ×${c.qty}</div>
        <div class="ci-opts">${c.opts.join(', ')}</div>
        <div class="ci-price">${c.unitPrice * c.qty} грн</div>
      </div>
      <button class="ci-rm" onclick="removeCart(${i})">✕</button>
    </div>`
  ).join('');

  el.innerHTML = `
    <div class="cart-items">${items}</div>
    <div class="cart-footer">
      <div class="cart-row"><span style="color:var(--t2)">Сума</span><span>${subtotal} грн</span></div>
      <div class="cart-row"><span style="color:var(--t2)">Доставка</span><span>${delivery} грн</span></div>
      <div class="cart-row cart-total-row">
        <span class="cart-total-lbl">Разом</span>
        <span class="cart-total-val">${subtotal + delivery} грн</span>
      </div>
      <button class="checkout-btn">Оформити замовлення →</button>
    </div>`;
}

function removeCart(i) {
  cart.splice(i, 1);
  updateCartBadge();
  renderCart();
}

function clearCart() {
  cart = [];
  updateCartBadge();
  renderCart();
}

/* ════════════════════════════════
   TOAST
════════════════════════════════ */
let toastTimer;

function showToast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('on');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('on'), 2500);
}

/* ════════════════════════════════
   ІНІЦІАЛІЗАЦІЯ
════════════════════════════════ */
document.querySelectorAll('.fi').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.fi').forEach(x => x.classList.remove('on'));
    f.classList.add('on');
  });
});

if (user) {
  document.getElementById('onb').style.display = 'none';
  updateProfile();
}
