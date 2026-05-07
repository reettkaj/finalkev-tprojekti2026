import '../css/style.css';
import '../css/mobile.css';
import '../css/kubios.css';

import { getUserData } from './kubios-data.js';

window.addEventListener('DOMContentLoaded', async () => {
  await getUserData();
});