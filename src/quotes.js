(() => {
  const cards = [...document.querySelectorAll('[data-quote]')];
  if (!cards.length) return;
  const position = document.getElementById('quote-position');
  const star = document.querySelector('.compass-art .star');
  let index = 0;
  let turns = 0;
  function nextQuote() {
    index = (index + 1) % cards.length;
    cards.forEach((card, i) => { card.hidden = i !== index; });
    position.textContent = `${String(index + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
    turns++;
    star.style.transform = `rotate(${turns * 45}deg)`;
  }
  document.querySelector('.compass-center').addEventListener('click', nextQuote);
  document.getElementById('quote-next').addEventListener('click', nextQuote);
})();
