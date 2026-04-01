let step = 0;
const steps = document.querySelectorAll('.step');

function showStep() {
  steps.forEach((s, index) => {
    s.style.display = index === step ? 'block' : 'none';
  });
}

function validateField(el) {
  let valid = true;
  let value = el.value.trim();

  // Validasi jika field 'required' ATAU jika ia mempunyai nilai (untuk field pilihan)
  if (el.hasAttribute('required') && value === '') {
    valid = false;
  } else if (value !== '') {
    if (el.type === 'number') {
      if (isNaN(value)) valid = false;
    }
    // Validasi spesifik untuk IC
    if (el.id === 'ic' && value.length < 10) {
      valid = false;
    }
    // Validasi spesifik untuk Telefon
    if (el.id === 'telefon' && value.length < 9) {
      valid = false;
    }
  }

  // Maklum balas visual
  if (!valid && el.hasAttribute('required')) {
    el.style.outline = '2px solid #ef4444'; // Merah
  } else if (valid && value !== '') {
    el.style.outline = '2px solid #22c55e'; // Hijau
  } else {
    el.style.outline = 'none'; // Kosongkan outline untuk field pilihan yang kosong
  }

  return valid;
}

function validateStep() {
  const current = steps[step];
  const inputs = current.querySelectorAll('input, select, textarea');
  let stepValid = true;

  inputs.forEach(el => {
    if (el.type === 'button') return;
    if (!validateField(el)) {
      stepValid = false;
    }
  });

  if (!stepValid) {
    setTimeout(() => {
      alert('Sila lengkapkan semua maklumat yang wajib dengan betul sebelum meneruskan.');
    }, 50);
  }

  return stepValid;
}

function next() {
  const isValid = validateStep();
  if (!isValid) return;

  if (step < steps.length - 1) {
    step++;
    showStep();
  } else {
    alert('Borang berjaya dihantar!');
    document.getElementById('form').reset();
    step = 0;
    showStep();
    // Reset semula semua outline
    document.querySelectorAll('input, select, textarea').forEach(el => el.style.outline = 'none');
  }
}

function prev() {
  if (step > 0) {
    step--;
    showStep();
  }
}

// Pasang validasi masa-nyata (real-time) pada semua input
const allInputs = document.querySelectorAll('input, select, textarea');
allInputs.forEach(el => {
  el.addEventListener('input', () => validateField(el));
});

// Paparkan langkah pertama semasa dimuatkan
showStep();
