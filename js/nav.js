/* ════════════════════════════════
   BRINGO — НАВІГАЦІЯ
════════════════════════════════ */

let cur     = 'home';
let curCat  = MENU[0].cat; // береться з data.js

/* ── Перейти на сторінку ── */
function goPage(id) {
  document.getElementById('pg-' + cur).classList.remove('on');
  document.getElementById('nb-' + cur)?.classList.remove('on');

  cur = id;

  document.getElementById('pg-' + id).classList.add('on');
  document.getElementById('nb-' + id)?.classList.add('on');
  document.getElementById('scr').scrollTop = 0;

  if (id === 'cart') renderCart();
}

/* ── Відкрити сторінку ресторану ── */ 
function openRest() {
  goPage('rest');
  buildTabs();
  renderCat(curCat);
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
   ФІЛЬТРИ (сторінка ресторанів)
════════════════════════════════ */
document.querySelectorAll('.fi').forEach(f => {
  f.addEventListener('click', () => {
    document.querySelectorAll('.fi').forEach(x => x.classList.remove('on'));
    f.classList.add('on');
  });
}); 
