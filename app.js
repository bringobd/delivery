/* ════════════════════════════════
   BRINGO — app.js
   Ролі: імʼя "1" = курʼєр, імʼя "2" = ресторан, інше = клієнт
════════════════════════════════ */

/* ════════════════════════════════
   ДАНІ МЕНЮ
════════════════════════════════ */
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
            options: [ { n: '32 см', p: 0 }, { n: '50 см', p: 190 } ]
          },
          {
            label: 'Додатки', sub: 'Виберіть до 10 варіантів', type: 'check', max: 10,
            options: [
              { n: 'Філе куряче копчене', p: 50 }, { n: 'Ковбаски до піцці', p: 30 },
              { n: 'Ковбаса Папероні', p: 90 },    { n: 'Помідор', p: 30 },
              { n: 'Сир піца', p: 60 },             { n: 'Сир Голандський', p: 40 },
              { n: 'Сир Пармезан', p: 60 },         { n: 'Ананас конерв.', p: 30 },
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
              { n: 'New сет', p: 700 },              { n: 'Банзай', p: 340 },
              { n: 'Бургер смажений', p: 310 },      { n: 'Зелений дракон', p: 280 },
              { n: 'Каліфорнія', p: 290 },           { n: 'Конкура', p: 320 },
              { n: 'Самурай', p: 320 },              { n: 'Самрайс', p: 450 },
              { n: 'Сімейний сет', p: 1100 },        { n: 'Філадельфія сет', p: 1150 },
              { n: 'Хітоцу сет', p: 650 },           { n: 'Хот-дог', p: 320 },
              { n: 'Гора Дракона сет', p: 1350 },    { n: 'Смажений сет', p: 850 },
              { n: 'Тигровий дракон', p: 310 },      { n: 'Філадельфія з тунцем', p: 250 },
              { n: 'Філадельфія класична', p: 250 }, { n: 'Футомакі', p: 270 },
              { n: 'Червоний дракон', p: 365 },      { n: 'Чорний дракон', p: 390 },
              { n: 'Азіатська шаурма краб', p: 290 },{ n: 'Смажена з лососем шаурма', p: 290 },
              { n: 'Big maki roll', p: 270 },
            ]
          },
        ]
      },
    ]
  },
];

/* ════════════════════════════════
   СТАТУСИ
════════════════════════════════ */
const STATUS = {
  new:        { label: '🆕 Нове замовлення',           color: '#FF5C00' },
  accepted:   { label: '✅ Прийнято рестораном',       color: '#FF5C00' },
  cooking:    { label: '👨‍🍳 Готується',                 color: '#F59E0B' },
  ready:      { label: '🍽 Готово! Чекає курʼєра',     color: '#22C55E' },
  picked:     { label: '🛵 Курʼєр забрав замовлення',  color: '#3B82F6' },
  delivering: { label: '🚀 В дорозі',                  color: '#8B5CF6' },
  done:       { label: '🎉 Доставлено!',               color: '#22C55E' },
};

/* ════════════════════════════════
   РОЛЬ
════════════════════════════════ */
let user = JSON.parse(localStorage.getItem('bringoUser') || 'null');

function getRole() {
  if (!user) return 'client';
  if (user.name === '1') return 'courier';
  if (user.name === '2') return 'restaurant';
  return 'client';
}

/* ════════════════════════════════
   СПІЛЬНИЙ СТАН ЗАМОВЛЕННЯ
════════════════════════════════ */
function getActiveOrder() {
  return JSON.parse(localStorage.getItem('bringoActiveOrder') || 'null');
}

function setActiveOrder(order) {
  localStorage.setItem('bringoActiveOrder', JSON.stringify(order));
  if (cur === 'orders') renderOrderPanels();
}

// Синхронізація між вкладками в одному браузері
window.addEventListener('storage', (e) => {
  if (e.key === 'bringoActiveOrder' && cur === 'orders') renderOrderPanels();
});

// Опитування кожні 2 сек для тесту
setInterval(() => { if (cur === 'orders') renderOrderPanels(); }, 2000);

/* ════════════════════════════════
   ONBOARDING
════════════════════════════════ */
function checkOnb() {
  document.getElementById('onbBtn').disabled = !document.getElementById('inpName').value.trim();
}

function finishOnb() {
  user = {
    name:    document.getElementById('inpName').value.trim(),
    surname: document.getElementById('inpSurname').value.trim(),
    phone:   document.getElementById('inpPhone').value.trim(),
  };
  localStorage.setItem('bringoUser', JSON.stringify(user));
  const el = document.getElementById('onb');
  el.style.transition = 'opacity .3s, transform .3s';
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  setTimeout(() => { el.remove(); applyRoleUI(); }, 320);
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
  document.getElementById('profPhone').textContent = user.phone ? '📞 +38' + user.phone : '🏅 Новий клієнт';
}

/* ════════════════════════════════
   ЗАСТОСУВАТИ UI ДЛЯ РОЛІ
════════════════════════════════ */
function applyRoleUI() {
  const role = getRole();
  if (role === 'restaurant' || role === 'courier') {
    document.getElementById('nb-rests').style.display = 'none';
    document.getElementById('nb-cart').style.display  = 'none';
    goPage('orders');
    showToast(role === 'restaurant' ? '👨‍🍳 Режим ресторану' : '🛵 Режим курʼєра');
  }
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
  if (id === 'cart')   renderCart();
  if (id === 'orders') renderOrderPanels();
}

function openRest() { goPage('rest'); buildTabs(); renderCat(curCat); }

/* ════════════════════════════════
   МЕНЮ РЕСТОРАНУ
════════════════════════════════ */
function buildTabs() {
  document.getElementById('catTabs').innerHTML = MENU.map(({ cat }) =>
    `<div class="ct ${cat === curCat ? 'on' : ''}" onclick="switchCat('${cat}')">${cat}</div>`
  ).join('');
}

function switchCat(cat) {
  curCat = cat;
  document.querySelectorAll('.ct').forEach(t => t.classList.toggle('on', t.textContent === cat));
  renderCat(cat);
  document.getElementById('scr').scrollTop = 0;
}

function renderCat(cat) {
  const { items } = MENU.find(s => s.cat === cat);
  document.getElementById('menuContent').innerHTML =
    `<div class="msec-title">${cat}</div><div class="mgrid">${items.map(item => {
      const d = JSON.stringify(item);
      return `<div class="mc" onclick='openModal(${d})'>
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
    }).join('')}</div>`;
}

/* ════════════════════════════════
   МОДАЛКА ТОВАРУ
════════════════════════════════ */
let mItem = null, mQty = 1, mSel = {};

function openModal(item) {
  mItem = item; mQty = 1; mSel = {};
  item.groups.forEach((g, gi) => { mSel[gi] = g.type === 'radio' ? 0 : new Set(); });
  document.getElementById('mImg').style.backgroundImage = `url('${item.img}')`;
  document.getElementById('mName').textContent  = item.n;
  document.getElementById('mDesc').textContent  = item.d;
  document.getElementById('mQtyEl').textContent = 1;
  renderGroups(); updTotal();
  document.getElementById('mOv').classList.add('on');
}

function closeModal() { document.getElementById('mOv').classList.remove('on'); }

function renderGroups() {
  document.getElementById('mGroups').innerHTML = mItem.groups.map((g, gi) => `
    <div class="grp">
      <div class="grp-label">${g.label}</div>
      <div class="grp-sub">${g.sub}</div>
      ${g.options.map((o, oi) => {
        if (g.type === 'radio') {
          const on = mSel[gi] === oi ? 'on' : '';
          const pr = g.isFull ? o.p + ' грн' : (oi === 0 ? mItem.basePrice + ' грн' : '+' + o.p + ' грн');
          return `<div class="row ${on}" onclick="pickRadio(${gi},${oi})">
            <div class="radio"><div class="radio-dot"></div></div>
            <span class="row-label">${o.n}</span><span class="row-price">${pr}</span></div>`;
        } else {
          const on = mSel[gi].has(oi) ? 'on' : '';
          return `<div class="crow ${on}" onclick="pickCheck(${gi},${oi},${g.max||99})">
            <div class="chk">${mSel[gi].has(oi)?'✓':''}</div>
            <span class="crow-label">${o.n}</span><span class="crow-price">+${o.p} грн</span></div>`;
        }
      }).join('')}
    </div>`).join('');
}

function pickRadio(gi, oi) {
  mSel[gi] = oi;
  document.querySelectorAll('.grp')[gi].querySelectorAll('.row').forEach((r, i) => {
    r.classList.toggle('on', i === oi);
    r.querySelector('.radio-dot').style.opacity = i === oi ? '1' : '0';
  });
  updTotal();
}

function pickCheck(gi, oi, max) {
  const s = mSel[gi];
  if (s.has(oi)) { s.delete(oi); }
  else { if (s.size >= max) { showToast('Максимум ' + max + ' варіантів'); return; } s.add(oi); }
  document.querySelectorAll('.grp')[gi].querySelectorAll('.crow').forEach((r, i) => {
    r.classList.toggle('on', s.has(i));
    r.querySelector('.chk').textContent = s.has(i) ? '✓' : '';
  });
  updTotal();
}

function calcPrice() {
  let total = mItem.basePrice;
  mItem.groups.forEach((g, gi) => {
    if (g.type === 'radio') total = g.isFull ? g.options[mSel[gi]].p : total + (g.options[mSel[gi]]?.p || 0);
    else mSel[gi].forEach(oi => total += g.options[oi].p);
  });
  return total * mQty;
}

function updTotal() { document.getElementById('mTotal').textContent = calcPrice() + ' грн'; }

function chQty(d) {
  mQty = Math.max(1, mQty + d);
  document.getElementById('mQtyEl').textContent = mQty;
  updTotal();
}

function addCart() {
  const unitPrice = calcPrice() / mQty;
  const optLines = [];
  mItem.groups.forEach((g, gi) => {
    if (g.type === 'radio') optLines.push(g.options[mSel[gi]].n);
    else mSel[gi].forEach(oi => optLines.push(g.options[oi].n));
  });
  cart.push({ item: mItem, opts: optLines, unitPrice, qty: mQty });
  updateCartBadge(); closeModal();
  showToast('✅ ' + mItem.n + ' · ' + optLines[0]);
}

/* ════════════════════════════════
   КОШИК
════════════════════════════════ */
let cart = [];

function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const b = document.getElementById('cartBadge');
  b.textContent = total || '';
  b.classList.toggle('on', total > 0);
}

function renderCart() {
  const el = document.getElementById('cartBody');
  document.getElementById('cartClear').style.display = cart.length ? 'block' : 'none';
  if (!cart.length) {
    el.innerHTML = `<div class="cart-empty"><span>🛒</span><h3>Кошик порожній</h3>
      <p>Додайте страви з меню</p><button class="cta" onclick="openRest()">До меню</button></div>`;
    return;
  }
  const subtotal = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
  el.innerHTML = `
    <div class="cart-items">${cart.map((c, i) => `
      <div class="ci">
        <div class="ci-img" style="background-image:url('${c.item.img}')"></div>
        <div class="ci-info">
          <div class="ci-name">${c.item.n} ×${c.qty}</div>
          <div class="ci-opts">${c.opts.join(', ')}</div>
          <div class="ci-price">${c.unitPrice * c.qty} грн</div>
        </div>
        <button class="ci-rm" onclick="removeCart(${i})">✕</button>
      </div>`).join('')}
    </div>
    <div class="cart-footer">
      <div class="cart-row"><span style="color:var(--t2)">Сума</span><span>${subtotal} грн</span></div>
      <div class="cart-row"><span style="color:var(--t2)">Доставка</span><span>50 грн</span></div>
      <div class="cart-row cart-total-row">
        <span class="cart-total-lbl">Разом</span>
        <span class="cart-total-val">${subtotal + 50} грн</span>
      </div>
      <button class="checkout-btn" onclick="placeOrder()">Оформити замовлення →</button>
    </div>`;
}

function removeCart(i) { cart.splice(i, 1); updateCartBadge(); renderCart(); }
function clearCart()    { cart = []; updateCartBadge(); renderCart(); }

/* ════════════════════════════════
   ОФОРМИТИ ЗАМОВЛЕННЯ
════════════════════════════════ */
function placeOrder() {
  if (!cart.length) return;
  const order = {
    id:      Date.now(),
    status:  'new',
    items:   cart.map(c => ({ name: c.item.n, opts: c.opts, price: c.unitPrice * c.qty, qty: c.qty })),
    total:   cart.reduce((s, c) => s + c.unitPrice * c.qty, 0) + 50,
    address: 'вул. Приморська 12, кв. 3',
    client:  user ? [user.name, user.surname].filter(Boolean).join(' ') : 'Гість',
    time:    new Date().toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' }),
  };
  setActiveOrder(order);
  cart = []; updateCartBadge();
  goPage('orders');
  showToast('🎉 Замовлення відправлено до ресторану!');
}

/* ════════════════════════════════
   ЗМІНА СТАТУСУ
════════════════════════════════ */
function changeStatus(newStatus) {
  const order = getActiveOrder();
  if (!order) return;
  order.status = newStatus;
  setActiveOrder(order);
  showToast(STATUS[newStatus].label);
  renderOrderPanels();
}

function clearActiveOrder() {
  localStorage.removeItem('bringoActiveOrder');
  renderOrderPanels();
}

/* ════════════════════════════════
   РЕНДЕР СТОРІНКИ ЗАМОВЛЕНЬ
════════════════════════════════ */
function renderOrderPanels() {
  const el    = document.getElementById('ordersBody');
  if (!el) return;
  const order = getActiveOrder();
  const role  = getRole();

  // Порожній стан
  if (!order) {
    const msgs = {
      client:     ['📦', 'Замовлень поки немає', 'Зробіть перше замовлення!', `<button class="cta" onclick="openRest()">До меню</button>`],
      restaurant: ['🍽', 'Нових замовлень немає', 'Очікуйте на замовлення від клієнтів', ''],
      courier:    ['🛵', 'Немає активних доставок', 'Очікуйте коли ресторан підготує замовлення', ''],
    };
    const [icon, title, sub, btn] = msgs[role];
    el.innerHTML = `<div class="ord-empty"><span>${icon}</span><h3>${title}</h3><p>${sub}</p>${btn}</div>`;
    return;
  }

  // Курʼєр не бачить замовлення поки ресторан не почав готувати
  if (role === 'courier' && ['new', 'accepted'].includes(order.status)) {
    el.innerHTML = `<div class="ord-empty"><span>🛵</span>
      <h3>Ресторан ще приймає замовлення</h3>
      <p>Повідомлення зʼявиться коли розпочнеться готування</p></div>`;
    return;
  }

  const st = STATUS[order.status];

  // Кнопки дій
  let actionBtn = '';
  if (role === 'restaurant') {
    if      (order.status === 'new')      actionBtn = btn('✅ Прийняти замовлення', "changeStatus('accepted')");
    else if (order.status === 'accepted') actionBtn = btn('👨‍🍳 Почати готувати', "changeStatus('cooking')");
    else if (order.status === 'cooking')  actionBtn = btn('🍽 Страва готова!', "changeStatus('ready')");
    else if (order.status === 'ready')    actionBtn = btnDisabled('⏳ Чекаємо курʼєра…', '#gl', '#g');
    else                                  actionBtn = btnDisabled(st.label);
  } else if (role === 'courier') {
    if      (order.status === 'cooking')    actionBtn = btnDisabled('👨‍🍳 Ресторан готує — їдьте до закладу');
    else if (order.status === 'ready')      actionBtn = btn('🛵 Забрав замовлення', "changeStatus('picked')");
    else if (order.status === 'picked')     actionBtn = btn('🚀 Виїхав до клієнта', "changeStatus('delivering')");
    else if (order.status === 'delivering') actionBtn = btn('🎉 Доставлено клієнту!', "changeStatus('done')", '#22C55E');
    else                                    actionBtn = btnDisabled(st.label);
  } else {
    // Клієнт
    actionBtn = order.status === 'done'
      ? btn('🆕 Зробити нове замовлення', 'clearActiveOrder()')
      : `<div style="text-align:center;font-size:12px;color:var(--t2);padding:8px 0">Автоматичне оновлення статусу…</div>`;
  }

  const steps = ['new','accepted','cooking','ready','picked','delivering','done'];
  const curIdx = steps.indexOf(order.status);

  el.innerHTML = `<div style="padding:0 18px 24px">

    <div style="background:${st.color}22;border:1.5px solid ${st.color}66;border-radius:16px;padding:16px;margin-bottom:14px;display:flex;align-items:center;gap:12px">
      <div style="font-size:32px;line-height:1">${st.label.split(' ')[0]}</div>
      <div>
        <div style="font-family:'Geologica',sans-serif;font-weight:900;font-size:15px;color:${st.color}">${st.label.slice(st.label.indexOf(' ')+1)}</div>
        <div style="font-size:11px;color:var(--t2);margin-top:2px">Замовлення #${String(order.id).slice(-4)} · ${order.time}</div>
      </div>
    </div>

    <div style="background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:14px;margin-bottom:14px">
      <div style="font-family:'Geologica',sans-serif;font-size:11px;font-weight:800;color:var(--or);text-transform:uppercase;letter-spacing:.6px;margin-bottom:10px">Склад замовлення</div>
      ${order.items.map(i => `
        <div style="display:flex;justify-content:space-between;align-items:flex-start;padding:7px 0;border-bottom:1px solid var(--bd);font-size:13px;font-weight:600">
          <div>${i.name} ×${i.qty}<div style="font-size:10px;color:var(--t2);margin-top:2px">${i.opts.join(', ')}</div></div>
          <div style="font-family:'Geologica',sans-serif;font-weight:900;color:var(--or);flex-shrink:0;margin-left:8px">${i.price} грн</div>
        </div>`).join('')}
      <div style="display:flex;justify-content:space-between;padding:10px 0 0;font-family:'Geologica',sans-serif;font-size:14px;font-weight:900">
        <span>Разом</span><span style="color:var(--or)">${order.total} грн</span>
      </div>
    </div>

    <div style="background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:14px;margin-bottom:14px;font-size:13px;font-weight:600">
      <div style="font-family:'Geologica',sans-serif;font-size:11px;font-weight:800;color:var(--or);text-transform:uppercase;letter-spacing:.6px;margin-bottom:8px">Деталі доставки</div>
      <div style="color:var(--t2);margin-bottom:5px">👤 Клієнт: <span style="color:var(--t1)">${order.client}</span></div>
      <div style="color:var(--t2)">📍 Адреса: <span style="color:var(--t1)">${order.address}</span></div>
    </div>

    <div style="background:var(--s2);border:1px solid var(--bd);border-radius:14px;padding:14px;margin-bottom:14px">
      <div style="font-family:'Geologica',sans-serif;font-size:11px;font-weight:800;color:var(--or);text-transform:uppercase;letter-spacing:.6px;margin-bottom:12px">Статус доставки</div>
      ${steps.map((s, i) => {
        const done   = i < curIdx;
        const active = i === curIdx;
        const color  = active ? STATUS[s].color : done ? '#22C55E' : 'var(--t3)';
        const dot    = active ? '●' : done ? '✓' : '○';
        return `<div style="display:flex;align-items:center;gap:10px;padding:5px 0;opacity:${done||active?1:.4}">
          <div style="font-size:14px;color:${color};width:18px;text-align:center;font-weight:900">${dot}</div>
          <div style="font-size:12px;font-weight:700;color:${active?color:'var(--t2)'}">${STATUS[s].label.slice(STATUS[s].label.indexOf(' ')+1)}</div>
        </div>`;
      }).join('')}
    </div>

    ${actionBtn}
  </div>`;
}

function btn(label, onclick, bg = 'var(--or)') {
  return `<button onclick="${onclick}" style="width:100%;padding:15px;background:${bg};border:none;border-radius:14px;color:#fff;font-family:'Geologica',sans-serif;font-size:14px;font-weight:900;cursor:pointer">${label}</button>`;
}

function btnDisabled(label, bg = 'var(--s3)', color = 'var(--t2)') {
  return `<button disabled style="width:100%;padding:15px;background:${bg};border:1px solid var(--bd);border-radius:14px;color:${color};font-family:'Geologica',sans-serif;font-size:14px;font-weight:800;cursor:default">${label}</button>`;
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
  toastTimer = setTimeout(() => el.classList.remove('on'), 2800);
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
  applyRoleUI();
}
