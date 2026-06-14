/**
 * contact.js — Contact form validation and submission handling
 * Client-side validation with accessible error feedback.
 * (Wires to a backend or Formspree endpoint — configurable below.)
 */

const ENDPOINT = ''; // e.g. 'https://formspree.io/f/YOUR_ID' or your own API

export function initContact() {
  const form      = document.getElementById('contact-form');
  const statusEl  = document.getElementById('form-status');
  const submitBtn = form?.querySelector('[type="submit"]');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!validateForm(form)) return;

    // Loading state
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled   = true;
    submitBtn.innerHTML  = '<span style="opacity:.7">Sending…</span>';
    hideStatus();

    try {
      if (ENDPOINT) {
        const data = new FormData(form);
        const res  = await fetch(ENDPOINT, {
          method: 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error('Server error');
        showStatus('success', '✓ Message sent! I\'ll get back to you soon.');
        form.reset();
      } else {
        // No endpoint configured — demo success
        await delay(900);
        showStatus('success', '✓ Message received (demo mode). Connect a real endpoint via contact.js.');
        form.reset();
      }
    } catch {
      showStatus('error', '✗ Something went wrong. Please email me directly.');
    } finally {
      submitBtn.disabled  = false;
      submitBtn.innerHTML = originalText;
    }
  });

  // Real-time field validation on blur
  form.querySelectorAll('.form-input, .form-textarea').forEach(input => {
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => clearFieldError(input));
  });
}

/* ── Validation helpers ─────────────────────────────────────── */

function validateForm(form) {
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    if (!validateField(field)) valid = false;
  });
  return valid;
}

function validateField(field) {
  clearFieldError(field);

  if (!field.value.trim()) {
    setFieldError(field, 'This field is required.');
    return false;
  }

  if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) {
    setFieldError(field, 'Please enter a valid email address.');
    return false;
  }

  return true;
}

function setFieldError(field, msg) {
  field.style.borderColor = '#FF5F57';
  field.style.boxShadow   = '0 0 0 3px rgba(255,95,87,0.15)';

  // Accessible error message
  let errEl = field.parentElement.querySelector('.field-error');
  if (!errEl) {
    errEl = document.createElement('p');
    errEl.className = 'field-error';
    errEl.style.cssText = 'color:#FF5F57;font-size:0.75rem;margin-top:4px;';
    errEl.setAttribute('role', 'alert');
    field.parentElement.appendChild(errEl);
  }
  errEl.textContent = msg;
  field.setAttribute('aria-invalid', 'true');
  field.setAttribute('aria-describedby', errEl.id || (errEl.id = `err-${field.id}`));
}

function clearFieldError(field) {
  field.style.borderColor = '';
  field.style.boxShadow   = '';
  field.removeAttribute('aria-invalid');
  const errEl = field.parentElement.querySelector('.field-error');
  if (errEl) errEl.remove();
}

function showStatus(type, msg) {
  const el = document.getElementById('form-status');
  if (!el) return;
  el.className      = `form-status ${type}`;
  el.textContent    = msg;
  el.style.display  = 'block';
}

function hideStatus() {
  const el = document.getElementById('form-status');
  if (el) el.style.display = 'none';
}

const delay = ms => new Promise(r => setTimeout(r, ms));
