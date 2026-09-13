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
