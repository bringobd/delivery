/* ════════════════════════════════
   BRINGO — СТОРІНКА РЕСТОРАНУ
   Залежності: data.js, nav.js
════════════════════════════════ */

/* ── Побудувати вкладки категорій ── */
function buildTabs() {
  document.getElementById('catTabs').innerHTML = MENU.map(({ cat }) =>
    `<div class="ct ${cat === curCat ? 'on' : ''}" onclick="switchCat('${cat}')">${cat}</div>`
  ).join('');
}

/* ── Переключити категорію ── */
function switchCat(cat) {
  curCat = cat;
  document.querySelectorAll('.ct').forEach(t =>
    t.classList.toggle('on', t.textContent === cat)
  );
  renderCat(cat);
  document.getElementById('scr').scrollTop = 0; 
}

/* ── Відрендерити страви обраної категорії ── */
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
    `<div class="msec-title">${cat}</div>
     <div class="mgrid">${cards}</div>`;
}
