import '../css/style.css';
import '../css/mobile.css';
import '../css/diary-card.css';

import { getEntries } from './entries.js';

const getEntriesBtn = document.querySelector('.get_entries');
getEntriesBtn.addEventListener('click', getEntries);

