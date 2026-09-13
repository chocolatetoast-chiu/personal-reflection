'use strict';
function applyFilter() {
  const topic = document.querySelector('[data-filter].active')?.dataset.filter || 'all';
  const year = document.querySelector('#year-filter')?.value || 'all';
  let count = 0;
  document.querySelectorAll('[data-topics]').forEach(row => {
    row.hidden = !((topic === 'all' || row.dataset.topics.split('|').includes(topic)) && (year === 'all' || row.dataset.year === year));
    if (!row.hidden) count++;
  });
  const status = document.querySelector('#result-count');
  if (status) status.textContent = `顯示 ${count} 篇手記`;
  const empty = document.querySelector('#empty');
  if (empty) empty.hidden = count !== 0;
}
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
  document.querySelectorAll('[data-filter]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
  applyFilter();
}));
document.querySelector('#year-filter')?.addEventListener('change', applyFilter);
function toggleCard(button) {
  const target = document.getElementById(button.getAttribute('aria-controls'));
  if (!target) return;
  const open = button.getAttribute('aria-expanded') !== 'true';
  button.setAttribute('aria-expanded', String(open));
  target.hidden = !open;
}
document.querySelectorAll('[data-disclosure]').forEach(button => button.addEventListener('click', () => toggleCard(button)));
const compass = document.querySelector('.compass-center');
compass?.addEventListener('click', () => {
  const open = compass.getAttribute('aria-expanded') !== 'true';
  compass.setAttribute('aria-expanded', String(open));
  compass.closest('.compass-art').classList.toggle('is-open', open);
  const caption = document.getElementById('compass-caption');
  caption.innerHTML = open ? '<strong>用愛與真誠，真實且善良地與世界連結。</strong><span>摘自〈找到我的北極星〉</span>' : '<strong>我的北極星</strong><span>點一下星芒，讀一句提醒</span>';
});
const countStart = document.querySelector('#count-start');
if (countStart) {
  const digit = document.querySelector('#count-digit');
  const output = document.querySelector('#count-status');
  const ticks = [...document.querySelectorAll('.tick-line i')];
  let timer = null;
  function reset() {
    clearInterval(timer); timer = null;
    digit.textContent = '5'; output.textContent = '先想一件，現在就能開始的小事。';
    countStart.disabled = false; countStart.textContent = '開始倒數 ↗';
    ticks.forEach(tick => tick.classList.remove('lit'));
  }
  countStart.addEventListener('click', () => {
    clearInterval(timer);
    const deadline = Date.now() + 5000;
    countStart.disabled = true; countStart.textContent = '倒數中';
    output.textContent = '把注意力，放回眼前這件事。';
    timer = setInterval(() => {
      const remaining = Math.max(0, Math.ceil((deadline - Date.now()) / 1000));
      digit.textContent = String(remaining);
      ticks.forEach((tick, index) => tick.classList.toggle('lit', index >= remaining));
      if (!remaining) {
        clearInterval(timer); timer = null;
        output.textContent = '現在，開始做。'; countStart.disabled = false; countStart.textContent = '再倒數一次 ↗';
      }
    }, 100);
    digit.textContent = '5'; ticks.forEach(tick => tick.classList.remove('lit'));
  });
  document.querySelector('#count-reset').addEventListener('click', reset);
}
function switchMetric(button) {
  document.querySelector('.article-body')?.classList.toggle('large', button.dataset.size === 'large');
  document.querySelectorAll('[data-size]').forEach(item => {
    item.classList.toggle('active', item === button);
    item.setAttribute('aria-pressed', String(item === button));
  });
}
document.querySelectorAll('[data-size]').forEach(button => button.addEventListener('click', () => switchMetric(button)));
const progress = document.querySelector('.reading-progress');
const article = document.querySelector('.article-body');
if (progress && article) {
  const update = () => {
    const start = article.offsetTop;
    const distance = article.offsetHeight - window.innerHeight;
    const fraction = distance <= 0 ? 1 : Math.max(0, Math.min(1, (window.scrollY - start) / distance));
    progress.style.width = `${fraction * 100}%`;
  };
  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  window.addEventListener('load', update);
  update();
}
