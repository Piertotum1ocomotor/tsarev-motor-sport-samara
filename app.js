const jobs = [...document.querySelectorAll('[name="job"]')];
const maintenance = jobs.find(job => job.value === 'maintenance');
const oil = jobs.find(job => job.value === 'oil');
const suspension = jobs.find(job => job.value === 'suspension');
const hours = document.querySelector('#hours');
const hourControl = document.querySelector('#hour-control');
const total = document.querySelector('#estimate-total');
const note = document.querySelector('#estimate-note');
const reset = document.querySelector('#reset');
const estimateJump = document.querySelector('#estimate-jump');
const estimateJumpText = document.querySelector('#estimate-jump-text');
const numbers = new Intl.NumberFormat('ru-RU');
const range = (min, max) => `${numbers.format(min)}–${numbers.format(max)} ₽`;

function updateEstimate() {
  const selected = jobs.filter(job => job.checked);
  const unknownHours = suspension.checked && !hours.value;
  const timedOrFixed = selected.filter(job => job !== suspension || !unknownHours);
  let min = 0;
  let max = 0;
  for (const job of timedOrFixed) {
    const quantity = job === suspension ? Number(hours.value) : 1;
    min += Number(job.dataset.min) * quantity;
    max += Number(job.dataset.max) * quantity;
  }

  hourControl.hidden = !suspension.checked;
  reset.hidden = selected.length === 0;
  total.textContent = timedOrFixed.length ? range(min, max) : '—';
  estimateJump.hidden = selected.length === 0;
  estimateJumpText.textContent = timedOrFixed.length
    ? (unknownHours ? 'Без подвески ' : 'Расчёт ') + total.textContent
    : 'К почасовому тарифу';
  if (unknownHours) {
    const hourlyPrice = 'Подвеска отдельно: 900–1 800 ₽ / час. Укажите время, чтобы включить ремонт в сумму.';
    note.textContent = timedOrFixed.length ? 'Сумма без ремонта подвески. ' + hourlyPrice : hourlyPrice;
  } else {
    note.textContent = selected.length ? 'Предварительная стоимость работ' : 'Отметьте нужные работы в прайсе.';
  }
  if (selected.some(job => job.value === 'climate') && selected.some(job => job.value === 'radiator')) {
    note.textContent += '. Для кондиционера и радиаторов уточните условия совместной акции у мастера.';
  }
}

for (const job of jobs) {
  job.addEventListener('change', () => {
    if (job === maintenance && maintenance.checked) oil.checked = false;
    if (job === oil && oil.checked) maintenance.checked = false;
    if (!suspension.checked) hours.value = '';
    updateEstimate();
  });
}
hours.addEventListener('change', updateEstimate);
reset.addEventListener('click', () => {
  for (const job of jobs) job.checked = false;
  hours.value = '';
  jobs[0].focus();
  updateEstimate();
});
window.addEventListener('pageshow', updateEstimate);
