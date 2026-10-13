const form = document.querySelector('#registration-form');
const message = document.querySelector('#form-message');
const submitButton = document.querySelector('#submit-button');
const fields = ['fullName', 'gender', 'dateOfBirth', 'email', 'phone', 'course', 'address'];
const today = new Date();
document.querySelector('#dateOfBirth').max = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}`;

function showFieldError(name, text) {
  const input = document.getElementById(name);
  const error = document.getElementById(`${name}-error`);
  input.classList.toggle('invalid', Boolean(text));
  input.setAttribute('aria-invalid', text ? 'true' : 'false');
  error.textContent = text || '';
}
function validate() {
  let valid = true;
  const value = Object.fromEntries(fields.map((name) => [name, document.getElementById(name).value.trim()]));
  const errors = {};
  for (const name of fields) if (!value[name]) errors[name] = 'This field is required.';
  if (value.fullName && value.fullName.length < 2) errors.fullName = 'Please enter your full name.';
  if (value.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.email)) errors.email = 'Enter a valid email address.';
  if (value.phone && !/^[+()\d\s.-]{7,20}$/.test(value.phone)) errors.phone = 'Enter a valid phone number.';
  if (value.dateOfBirth && value.dateOfBirth > new Date().toISOString().slice(0,10)) errors.dateOfBirth = 'Date of birth cannot be in the future.';
  for (const name of fields) { showFieldError(name, errors[name] || ''); if (errors[name]) valid = false; }
  return valid;
}

for (const name of fields) {
  document.getElementById(name).addEventListener('input', () => showFieldError(name, ''));
  document.getElementById(name).addEventListener('change', () => showFieldError(name, ''));
}
form.addEventListener('submit', async (event) => {
  event.preventDefault();
  message.hidden = true;
  message.className = 'form-message';
  if (!validate()) {
    message.textContent = 'Please correct the highlighted fields and try again.';
    message.classList.add('failure'); message.hidden = false;
    form.querySelector('.invalid')?.focus();
    return;
  }
  const payload = Object.fromEntries(new FormData(form).entries());
  submitButton.disabled = true; submitButton.textContent = 'Submitting…';
  try {
    const response = await fetch('/api/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (!response.ok) {
      for (const name of result.fields || []) showFieldError(name, result.message);
      throw new Error(result.message || 'Registration could not be saved.');
    }
    message.textContent = `${result.message} Your reference number is ${result.studentId}.`;
    message.classList.add('success'); message.hidden = false;
    form.reset();
  } catch (error) {
    message.textContent = error.message === 'Failed to fetch' ? 'Cannot reach the server. Make sure you started the project with npm start.' : error.message;
    message.classList.add('failure'); message.hidden = false;
  } finally {
    submitButton.disabled = false; submitButton.innerHTML = 'Submit registration <span aria-hidden="true">→</span>';
  }
});
form.addEventListener('reset', () => {
  for (const name of fields) showFieldError(name, '');
  message.hidden = true; message.textContent = ''; message.className = 'form-message';
});
