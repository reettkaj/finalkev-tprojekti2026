import '../css/style.css';
import '../css/mobile.css';
import '../css/diary-card.css';

import { getEntries } from './entries.js';

const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

// --- TSQ toggle ---

const toggleBtn = document.getElementById('toggle-tsq');
const tsqContent = document.getElementById('tsq-content');

if (toggleBtn && tsqContent) {
  toggleBtn.addEventListener('click', () => {
    tsqContent.classList.toggle('hidden');

    // Vaihdetaan napin teksti
    if (tsqContent.classList.contains('hidden')) {
      toggleBtn.textContent = 'Psyykkisten traumaoireiden seulontakysely (TSQ)';
    } else {
      toggleBtn.textContent = 'Piilota TSQ-kysely';
    }
  });
}