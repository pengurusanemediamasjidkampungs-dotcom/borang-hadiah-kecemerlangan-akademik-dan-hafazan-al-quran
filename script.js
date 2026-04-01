const scriptURL = 'https://script.google.com/macros/s/AKfycbyDo_nNimiTUcuyKNGa0cZyq9WPgSZUMhHUc8HSjZHiym8zZHMAJSCQRDluFTdvm65d/exec';
let step = 0;
const steps = document.querySelectorAll('.step');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

/**
 * Menguruskan paparan langkah borang dan butang navigasi
 */
function showStep() {
  steps.forEach((s, index) => {
    s.style.display = index === step ? 'block' : 'none';
  });

  // Kawalan butang Kembali
  if (prevBtn) {
    prevBtn.style.display = step === 0 ? 'none' : 'inline-block';
  }

  // Kawalan teks butang Seterusnya/Hantar
  if (nextBtn) {
    nextBtn.innerText = step === steps.length - 1 ? 'Hantar Borang' : 'Seterusnya';
  }
}

/**
 * Validasi setiap medan input
 */
function validateField(el) {
  let valid = true;
  let value = el.value.trim();

  // Validasi jika 'required' atau mempunyai nilai
  if (el.hasAttribute('required') && value === '') {
    valid = false;
  } else if (value !== '') {
    if (el.type === 'number') {
      if (isNaN(value)) valid = false;
    }
    // Validasi No. IC (min 12 digit selalunya untuk MY)
    if (el.id === 'ic' && value.length < 12) {
      valid = false;
    }
    // Validasi Telefon (min 10 digit)
    if (el.id === 'telefon' && value.length < 10) {
      valid = false;
    }
  }

  // Maklum balas visual (Outline)
  if (!valid && el.hasAttribute('required')) {
    el.style.outline = '2px solid #ef4444'; // Merah
  } else if (valid && value !== '') {
    el.style.outline = '2px solid #22c55e'; // Hijau
  } else {
    el.style.outline = 'none';
  }

  return valid;
}

/**
 * Validasi semua input dalam langkah semasa
 */
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
      alert('Sila lengkapkan maklumat yang bertanda merah dengan betul.');
    }, 50);
  }

  return stepValid;
}

/**
 * Fungsi butang Seterusnya
 */
function next() {
  const isValid = validateStep();
  if (!isValid) return;

  if (step < steps.length - 1) {
    step++;
    showStep();
  } else {
    submitToGoogleSheet();
  }
}

/**
 * Penghantaran data ke Google Sheets melalui GAS
 */
function submitToGoogleSheet() {
  const form = document.getElementById('form');
  
  // Tukar status butang
  const originalBtnText = nextBtn.innerText;
  nextBtn.innerText = 'Menghantar...';
  nextBtn.disabled = true;

  // Kumpul data secara dinamik berdasarkan ID elemen
  const formData = {};
  const allInputs = form.querySelectorAll('input, select, textarea');
  allInputs.forEach(input => {
    if (input.id) {
      formData[input.id] = input.value;
    }
  });

  fetch(scriptURL, {
    method: 'POST',
    mode: 'no-cors',
    cache: 'no-cache',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  })
  .then(() => {
    alert('Tahniah! Borang anda telah berjaya dihantar.');
    form.reset();
    step = 0;
    showStep();
    // Buang semua outline selepas reset
    document.querySelectorAll('input, select, textarea').forEach(el => el.style.outline = 'none');
  })
  .catch(error => {
    console.error('Error:', error);
    alert('Ralat berlaku semasa penghantaran. Sila cuba lagi.');
  })
  .finally(() => {
    nextBtn.innerText = originalBtnText;
    nextBtn.disabled = false;
  });
}

/**
 * Fungsi butang Kembali
 */
function prev() {
  if (step > 0) {
    step--;
    showStep();
  }
}

// Event listener untuk validasi masa-nyata
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => validateField(el));
});

// Jalankan paparan awal
showStep();
