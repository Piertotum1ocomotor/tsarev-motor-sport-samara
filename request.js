const form = document.querySelector('#request-form');
const service = document.querySelector('#request-service');
const branch = document.querySelector('#request-branch');
const phone = document.querySelector('#request-phone');
const result = document.querySelector('#request-result');
const summary = document.querySelector('#request-summary');
const call = document.querySelector('#request-call');

const initialService = new URLSearchParams(location.search).get('usluga');
if ([...service.options].some(option => option.value === initialService)) {
  service.value = initialService;
}
form.querySelector('button[type="submit"]').disabled = false;

form.addEventListener('input', () => {
  phone.setCustomValidity('');
  result.hidden = true;
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const digits = phone.value.replace(/\D/g, '');
  if (!/^(?:[78])?\d{10}$/.test(digits) || !/^[+\d\s()-]+$/.test(phone.value)) {
    phone.setCustomValidity('Проверьте номер. Укажите 10 цифр или 11 цифр с кодом +7 или 8.');
    phone.reportValidity();
    return;
  }
  summary.textContent = `${service.selectedOptions[0].textContent} · ${branch.selectedOptions[0].textContent}`;
  call.href = branch.value;
  result.hidden = false;
  result.focus();
});
