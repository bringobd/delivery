/* ════════════════════════════════
   BRINGO — КОШИК
   Залежності: nav.js
════════════════════════════════ */

let cart = [];

/* ── Оновити лічильник на іконці кошика ── */
function updateCartBadge() {
  const total = cart.reduce((s, c) => s + c.qty, 0);
  const badge = document.getElementById('cartBadge'); 
  badge.textContent = total || '';
  badge.classList.toggle('on', total > 0);
}

/* ── Відрендерити сторінку кошика ── */
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

  const subtotal  = cart.reduce((s, c) => s + c.unitPrice * c.qty, 0);
  const delivery  = 50;
  const total     = subtotal + delivery;

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
      <div class="cart-row">
        <span style="color:var(--t2)">Сума</span>
        <span>${subtotal} грн</span>
      </div>
      <div class="cart-row">
        <span style="color:var(--t2)">Доставка</span>
        <span>${delivery} грн</span>
      </div>
      <div class="cart-row cart-total-row">
        <span class="cart-total-lbl">Разом</span>
        <span class="cart-total-val">${total} грн</span>
      </div>
      <button class="checkout-btn">Оформити замовлення →</button>
    </div>`;
}

/* ── Видалити позицію з кошика ── */
function removeCart(i) {
  cart.splice(i, 1);
  updateCartBadge();
  renderCart();
}

/* ── Очистити весь кошик ── */
function clearCart() {
  cart = [];
  updateCartBadge();
  renderCart();
}
