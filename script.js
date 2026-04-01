let step = 0;
const steps = document.querySelectorAll('.step');
const progress = document.getElementById('progress');

/**
 * Fungsi untuk memaparkan langkah yang aktif
 */
function showStep() {
    steps.forEach((s, i) => {
        s.classList.toggle('hidden', i !== step);
    });
    
    // Kemaskini lebar progress bar berdasarkan langkah semasa
    const progressWidth = ((step + 1) / steps.length * 100) + '%';
    progress.style.width = progressWidth;
}

/**
 * Fungsi untuk ke langkah seterusnya
 */
function next() {
    if (step < steps.length - 1) {
        step++;
        showStep();
    } else {
        alert('Borang dihantar!');
    }
}

/**
 * Fungsi untuk kembali ke langkah sebelumnya
 */
function prev() {
    if (step > 0) {
        step--;
        showStep();
    }
}

// Inisialisasi paparan pertama
showStep();
