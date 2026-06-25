const countdownTarget = new Date('October 4, 2026 12:00:00').getTime();
const daysEl = document.getElementById('days');
const hoursEl = document.getElementById('hours');
const minutesEl = document.getElementById('minutes');
const secondsEl = document.getElementById('seconds');

function updateCountdown() {
  const now = new Date().getTime();
  const distance = countdownTarget - now;
  if (distance <= 0) {
    daysEl.textContent = '00';
    hoursEl.textContent = '00';
    minutesEl.textContent = '00';
    secondsEl.textContent = '00';
    return;
  }

  const days = String(Math.floor(distance / (1000 * 60 * 60 * 24))).padStart(2, '0');
  const hours = String(Math.floor((distance / (1000 * 60 * 60)) % 24)).padStart(2, '0');
  const minutes = String(Math.floor((distance / (1000 * 60)) % 60)).padStart(2, '0');
  const seconds = String(Math.floor((distance / 1000) % 60)).padStart(2, '0');

  daysEl.textContent = days;
  hoursEl.textContent = hours;
  minutesEl.textContent = minutes;
  secondsEl.textContent = seconds;
}

setInterval(updateCountdown, 1000);
updateCountdown();

const rsvpForm = document.getElementById('rsvpForm');
const rsvpStatus = document.getElementById('rsvpStatus');
const songForm = document.getElementById('songForm');
const songStatus = document.getElementById('songStatus');
const photoUpload = document.getElementById('photoUpload');
const photoPreview = document.getElementById('photoPreview');
const dietSelect = document.getElementById('diet');
const dietOther = document.getElementById('dietOther');
const copyIbanBtn = document.getElementById('copyIban');
const copyStatus = document.getElementById('copyStatus');

const RSVP_DEADLINE = new Date('August 31, 2026 23:59:59').getTime();

rsvpForm.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.getElementById('guestName').value.trim();
  const count = document.getElementById('guestCount').value;
  const message = document.getElementById('message').value.trim();
  const diet = (dietSelect && dietSelect.value) ? dietSelect.value : '';
  const dietOtherVal = (dietOther && dietOther.value) ? dietOther.value.trim() : '';

  // Check RSVP deadline
  const now = new Date().getTime();
  if (now > RSVP_DEADLINE) {
    rsvpStatus.textContent = 'Mi dispiace — il termine per le conferme (31 agosto) è scaduto.';
    rsvpStatus.style.color = '#b85a6a';
    return;
  }

  if (!name) {
    rsvpStatus.textContent = 'Inserisci il nome per confermare la tua presenza.';
    return;
  }

  const rsvpData = { name, count, message, diet, dietOther: dietOtherVal, date: new Date().toISOString() };
  localStorage.setItem('weddingRSVP', JSON.stringify(rsvpData));
  rsvpStatus.textContent = 'Grazie! Il tuo RSVP è stato salvato localmente.';
  rsvpStatus.style.color = '#3f8d82';
  rsvpForm.reset();
});

// Show/hide "Altro" field when diet select changes
if (dietSelect) {
  dietSelect.addEventListener('change', () => {
    if (dietSelect.value === 'altro') {
      dietOther.style.display = 'block';
      dietOther.focus();
    } else {
      dietOther.style.display = 'none';
      dietOther.value = '';
    }
  });
}

songForm.addEventListener('submit', event => {
  event.preventDefault();
  const song = document.getElementById('songName').value.trim();
  const artist = document.getElementById('artistName').value.trim();

  if (!song || !artist) {
    songStatus.textContent = 'Per favore, inserisci titolo e artista della canzone.';
    return;
  }

  const songRequest = { song, artist, date: new Date().toISOString() };
  const storedRequests = JSON.parse(localStorage.getItem('songRequests') || '[]');
  storedRequests.push(songRequest);
  localStorage.setItem('songRequests', JSON.stringify(storedRequests));
  songStatus.textContent = 'Richiesta salvata. Grazie per il suggerimento!';
  songStatus.style.color = '#3f8d82';
  songForm.reset();
});

photoUpload.addEventListener('change', event => {
  const files = Array.from(event.target.files);
  photoPreview.innerHTML = '';
  files.forEach(file => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement('img');
      img.src = e.target.result;
      img.alt = file.name;
      photoPreview.appendChild(img);
    };
    reader.readAsDataURL(file);
  });
});

const savedRSVP = localStorage.getItem('weddingRSVP');
if (savedRSVP) {
  rsvpStatus.textContent = 'Hai già un RSVP salvato localmente. Puoi inviarne un altro se vuoi.';
  rsvpStatus.style.color = '#517275';
}

const savedSongs = JSON.parse(localStorage.getItem('songRequests') || '[]');
if (savedSongs.length) {
  songStatus.textContent = `Hai già inviato ${savedSongs.length} richiesta${savedSongs.length === 1 ? '' : 'e'}.`;
  songStatus.style.color = '#517275';
}

// Disable RSVP form if past deadline on load
if (new Date().getTime() > RSVP_DEADLINE) {
  Array.from(rsvpForm.elements).forEach(el => el.disabled = true);
  rsvpStatus.textContent = 'Il termine per la conferma è scaduto (31 agosto 2026).';
  rsvpStatus.style.color = '#b85a6a';
}

// Copy IBAN to clipboard
if (copyIbanBtn) {
  copyIbanBtn.addEventListener('click', async () => {
    const iban = document.getElementById('ibanValue').textContent.trim();
    try {
      await navigator.clipboard.writeText(iban);
      copyStatus.textContent = 'IBAN copiato negli appunti';
      copyStatus.style.color = '#3f8d82';
      setTimeout(() => copyStatus.textContent = '', 3500);
    } catch (err) {
      copyStatus.textContent = 'Impossibile copiare automaticamente. Seleziona e copia manualmente.';
      copyStatus.style.color = '#b85a6a';
    }
  });
}
