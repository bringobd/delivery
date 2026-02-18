/* ════════════════════════════════
   BRINGO — ONBOARDING / AUTH
════════════════════════════════ */

let user = JSON.parse(localStorage.getItem('bringoUser') || 'null');

/* ── Ввімкнути кнопку лише якщо є ім'я ── */
function checkOnb() {
  const val = document.getElementById('inpName').value.trim();
  document.getElementById('onbBtn').disabled = !val;
}

/* ── Зберегти користувача і закрити онбординг ── */
function finishOnb() {
  const name    = document.getElementById('inpName').value.trim();
  const surname = document.getElementById('inpSurname').value.trim();
  const phone   = document.getElementById('inpPhone').value.trim();

  user = { name, surname, phone };
  localStorage.setItem('bringoUser', JSON.stringify(user));

  hideOnb();
}

/* ── Анімоване приховування екрану онбордингу ── */
function hideOnb() {
  const el = document.getElementById('onb');
  el.style.transition = 'opacity .3s, transform .3s';
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(20px)';
  setTimeout(() => el.remove(), 320);

  updateProfile();
}

/* ── Вийти з акаунту ── */
function logout() {
  localStorage.removeItem('bringoUser');
  user = null;
  location.reload();
}

/* ── Оновити дані на сторінці профілю ── */
function updateProfile() {
  if (!user) return;

  const full = [user.name, user.surname].filter(Boolean).join(' ');
  document.getElementById('profName').textContent  = full || '—';
  document.getElementById('profPhone').textContent = user.phone
    ? '📞 +38' + user.phone
    : '🏅 Новий клієнт';
}

/* ── Ініціалізація при завантаженні сторінки ── */
(function init() {
  if (user) {
    document.getElementById('onb').style.display = 'none';
    updateProfile();
  }
  // якщо user === null — онбординг видимий за замовчуванням
})();
