const scriptURL = 'https://script.google.com/macros/s/AKfycbyDo_nNimiTUcuyKNGa0cZyq9WPgSZUMhHUc8HSjZHiym8zZHMAJSCQRDluFTdvm65d/exec';
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

  // Validasi jika field 'required' ATAU jika ia mempunyai nilai
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
    el.style.outline = 'none';
  }

  return valid;
}

function validateStep() {
  const current = steps[step];
  const inputs = current.querySelectorAll('input, select, textarea');
  let stepValid = true;

  inputs.forEach(el => {
    if (el.type === 'button' || el.type === 'submit') return;
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

  // Jika belum sampai langkah terakhir, teruskan ke langkah seterusnya
  if (step < steps.length - 1) {
    step++;
    showStep();
  } else {
    // LANGKAH TERAKHIR: Hantar data ke Google Sheets
    submitToGoogleSheet();
  }
}

function submitToGoogleSheet() {
  const form = document.getElementById('form');
  const submitBtn = document.querySelector('button[onclick="next()"]');
  
  // Tukar teks butang untuk tunjuk status loading
  const originalBtnText = submitBtn.innerText;
  submitBtn.innerText = 'Menghantar...';
  submitBtn.disabled = true;

  // Kumpul semua data dari input dalam bentuk JSON
  const formData = {};
  const allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    if (input.id || input.name) {
      formData[input.id || input.name] = input.value;
    }
  });

  // Hantar ke GAS menggunakan Fetch API
  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors', // Penting untuk mengelakkan isu CORS dengan GAS
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(formData)
  })
  .then(() => {
    alert('Borang berjaya dihantar!');
    form.reset();
    step = 0;
    showStep();
    // Reset semula semua outline
    document.querySelectorAll('input, select, textarea').forEach(el => el.style.outline = 'none');
  })
  .catch(error => {
    console.error('Ralat!', error.message);
    alert('Maaf, terdapat ralat semasa menghantar borang.');
  })
  .finally(() => {
    submitBtn.innerText = originalBtnText;
    submitBtn.disabled = false;
  });
}

function prev() {
  if (step > 0) {
    step--;
    showStep();
  }
}

// Pasang validasi masa-nyata (real-time)
const allInputs = document.querySelectorAll('input, select, textarea');
allInputs.forEach(el => {
  el.addEventListener('input', () => validateField(el));
});

// Paparkan langkah pertama semasa dimuatkan
showStep();
