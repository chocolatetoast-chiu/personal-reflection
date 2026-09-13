// Page-local tools: no network requests and no persistent storage.
(() => {
  const root = document.getElementById('practice');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-tool]')];
  const returnButton = document.getElementById('timer-return');
  let selectedTool = 'small';
  let timerState = 'idle';
  let remaining = 120000;
  let total = remaining;
  let deadline = 0;
  let interval = null;
  const duration = document.getElementById('focus-duration');
  const task = document.getElementById('focus-task');
  const start = document.getElementById('focus-start');
  const status = document.getElementById('focus-status');
  const clock = document.getElementById('focus-clock');
  const ring = document.getElementById('focus-ring');
  function showTool(id, focus = false) {
    selectedTool = id;
    tabs.forEach(tab => {
      const selected = tab.dataset.tool === id;
      tab.setAttribute('aria-selected', String(selected));
      tab.tabIndex = selected ? 0 : -1;
      document.getElementById(tab.getAttribute('aria-controls')).hidden = !selected;
      if (selected && focus) tab.focus();
    });
    drawTimer();
  }
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => showTool(tab.dataset.tool));
    tab.addEventListener('keydown', event => {
      let next = index;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); showTool(tabs[next].dataset.tool, true);
    });
  });
  function drawTimer() {
    const seconds = Math.ceil(remaining / 1000);
    const display = `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;
    clock.textContent = display;
    ring.style.setProperty('--progress', `${Math.max(0, Math.min(100, (total - remaining) / total * 100))}%`);
    const active = timerState !== 'idle';
    returnButton.hidden = selectedTool === 'focus' || !active;
    returnButton.textContent = `${timerState === 'done' ? '這一段已完成' : timerState === 'paused' ? '計時已暫停' : '正在專注'} · ${display} · 回到計時 ↗`;
  }
  function tick() {
    if (timerState !== 'running') return;
    remaining = Math.max(0, deadline - Date.now());
    if (remaining === 0) {
      clearInterval(interval); interval = null; timerState = 'done';
      start.textContent = '再做一輪'; duration.disabled = false; task.readOnly = false;
      status.textContent = '你可以停下來，也可以再選一小步。';
      document.getElementById('timer-announcement').textContent = '這一小段專注時間結束了。';
    }
    drawTimer();
  }
  function resetTimer() {
    clearInterval(interval); interval = null; timerState = 'idle';
    remaining = Number(duration.value) * 1000; total = remaining;
    document.getElementById('timer-announcement').textContent = '';
    duration.disabled = false; task.readOnly = false; start.textContent = '開始';
    status.textContent = '時間到了，可以停，也可以再做一小段。';
    drawTimer();
  }
  start.addEventListener('click', () => {
    if (timerState === 'running') {
      tick();
      if (timerState === 'done') return;
      clearInterval(interval); interval = null; timerState = 'paused';
      start.textContent = '繼續'; status.textContent = '已暫停，準備好再繼續。'; drawTimer(); return;
    }
    if (!task.value.trim()) { task.value = ''; task.reportValidity(); return; }
    if (timerState === 'idle' || timerState === 'done') {
      remaining = Number(duration.value) * 1000; total = remaining;
    }
    document.getElementById('timer-announcement').textContent = '';
    deadline = Date.now() + remaining; timerState = 'running';
    duration.disabled = true; task.readOnly = true; start.textContent = '暫停';
    status.textContent = `這段時間只做：${task.value.trim()}`;
    clearInterval(interval); interval = setInterval(tick, 250); tick();
  });
  duration.addEventListener('change', resetTimer);
  document.getElementById('focus-reset').addEventListener('click', resetTimer);
  document.addEventListener('visibilitychange', tick);
  window.addEventListener('pageshow', tick);
  returnButton.addEventListener('click', () => showTool('focus', true));
  const examples = {
    '寫作': ['寫完一份報告', '打開文件，先寫一個小標題'],
    '資料': ['整理資料', '打開資料表，先核對第一列'],
    '生活': ['整理房間', '把桌上的一件物品放回原位']
  };
  root.querySelectorAll('[data-example]').forEach(button => button.addEventListener('click', () => {
    const [big, small] = examples[button.dataset.example];
    document.getElementById('big-task').value = big;
    document.getElementById('small-step').value = small;
  }));
  function bringStep(text) {
    if (timerState === 'running' || timerState === 'paused') {
      showTool('focus', true);
      status.textContent = '還有一段計時沒結束。請先完成或重設，再換下一件事。';
      return;
    }
    resetTimer(); task.value = text; showTool('focus', true); task.focus();
  }
  document.getElementById('use-step').addEventListener('click', () => {
    const input = document.getElementById('small-step');
    if (!input.value.trim()) { input.value = ''; input.reportValidity(); return; }
    bringStep(input.value.trim());
  });
  document.getElementById('park-thoughts').addEventListener('click', () => {
    const input = document.getElementById('brain-dump');
    const lines = input.value.split(/\r?\n/).map(line => line.trim()).filter(Boolean);
    const message = document.getElementById('parking-status');
    if (!lines.length) { message.textContent = '先寫下一件正在佔著腦袋的事。'; input.focus(); return; }
    const list = document.getElementById('parking-list');
    list.replaceChildren();
    lines.forEach(line => {
      const row = document.createElement('li');
      const text = document.createElement('span'); text.textContent = line;
      const button = document.createElement('button'); button.type = 'button'; button.textContent = '先做這件 ↗';
      button.setAttribute('aria-label', `先做這件：${line}`);
      button.addEventListener('click', () => {
        document.getElementById('big-task').value = line.slice(0, 180);
        document.getElementById('small-step').value = '';
        showTool('small', true); document.getElementById('small-step').focus();
      });
      row.append(text, button); list.append(row);
    });
    message.textContent = `已放下 ${lines.length} 件事。選一件，把下一步寫小一點。`;
  });
  document.getElementById('copy-invite').addEventListener('click', async () => {
    const text = document.getElementById('buddy-message').textContent;
    const result = document.getElementById('copy-status');
    try {
      await navigator.clipboard.writeText(text);
      result.textContent = '已複製，貼給你想一起開工的人。';
    } catch {
      result.textContent = '這個瀏覽器無法自動複製，請選取上方文字後複製。';
    }
  });
})();
