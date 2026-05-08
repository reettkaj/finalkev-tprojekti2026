import { fetchData } from './fetch.js';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const diaryContainer = document.querySelector('.diary-card-area');
const getEntriesButton = document.querySelector('.get_entries');
const form = document.querySelector('.entry-form');

let editingEntryId = null;

/////////////////////////////////////////////////
// Dialog
/////////////////////////////////////////////////

const dialog = document.querySelector('.diary_dialog');
const closeButton = document.querySelector('.diary_dialog button');

if (closeButton) {
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
}

/////////////////////////////////////////////////
// Hae merkinnät
/////////////////////////////////////////////////

const getEntries = async () => {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    console.error('user_id puuttuu');
    return;
  }

  const token = localStorage.getItem('token');

  const url = `${API_BASE}/entries/user/${userId}`;

  const response = await fetchData(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response || response.error) {
    console.error('Virhe merkintöjen haussa:', response?.error);
    return;
  }

  diaryContainer.innerHTML = '';

  if (response.length === 0) {
    diaryContainer.innerHTML = '<p>Ei päiväkirjamerkintöjä.</p>';
    return;
  }

  response.forEach((entry) => {
    const card = document.createElement('div');
    card.classList.add('diary-card');

    const formattedDate = new Date(entry.created_at).toLocaleDateString();

    card.innerHTML = `
      <h3>${formattedDate}</h3>
      <p>Mood: ${entry.mood ?? '-'}</p>
      <p>Weight: ${entry.weight ?? '-'} kg</p>
      <p>Sleep: ${entry.sleep ?? '-'} h</p>
      <p>Energy: ${entry.energy ?? '-'}</p>
      <p>Stress: ${entry.stress ?? '-'}</p>
      <p>Symptom: ${entry.symptoms ?? '-'}</p>
      <p>Medication: ${entry.medication ?? '-'}</p>
      <button class="edit-btn">Muokkaa</button>
      <button class="delete-btn">Poista</button>
    `;

    const deleteBtn = card.querySelector('.delete-btn');

    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm('Poistetaanko merkintä?');
      if (!confirmDelete) return;

      try {
        const response = await fetchData(
          `${API_BASE}/entries/${entry.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Poistettu:', response);
        await getEntries();
      } catch (error) {
        console.error('Poistovirhe:', error);
      }
    });

    const editBtn = card.querySelector('.edit-btn');

    editBtn.addEventListener('click', () => {
      editingEntryId = entry.id;

      form.querySelector('[name="entry_date"]').value =
        new Date(entry.created_at).toISOString().split('T')[0];

      form.querySelector('[name="weight"]').value = entry.weight ?? '';
      form.querySelector('[name="sleep_hours"]').value = entry.sleep ?? '';
      form.querySelector('[name="energy_level"]').value = entry.energy ?? '';
      form.querySelector('[name="stress_level"]').value = entry.stress ?? '';
      form.querySelector('[name="mood"]').value = entry.mood ?? '';
      form.querySelector('[name="symptom"]').value = entry.symptoms ?? '';
      form.querySelector('[name="medication"]').value = entry.medication ?? '';
      form.querySelector('[name="notes"]').value = entry.notes ?? '';

      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    diaryContainer.appendChild(card);
  });
};

/////////////////////////////////////////////////
// Lisää / muokkaa
/////////////////////////////////////////////////

const addEntry = async (event) => {
  event.preventDefault();

  const formData = new FormData(form);

  const entry = {
    entry_date: formData.get('entry_date'),
    weight: parseFloat(formData.get('weight')),
    sleep_hours: parseFloat(formData.get('sleep_hours')),
    energy_level: formData.get('energy_level')
      ? parseInt(formData.get('energy_level'))
      : null,
    stress_level: formData.get('stress_level')
      ? parseInt(formData.get('stress_level'))
      : null,
    mood: formData.get('mood'),
    symptom: formData.get('symptom') || null,
    medication: formData.get('medication') || null,
    notes: formData.get('notes') || null,
  };

  const token = localStorage.getItem('token');

  if (!token) {
    console.error('Token puuttuu');
    return;
  }

  try {
    const url = editingEntryId
      ? `${API_BASE}/entries/${editingEntryId}`
      : `${API_BASE}/entries`;

    const method = editingEntryId ? 'PUT' : 'POST';

    const response = await fetchData(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });

    if (!response || response.error) {
      console.error('Tallennus epäonnistui:', response);
      alert('Merkinnän tallennus epäonnistui');
      return;
    }

    editingEntryId = null;
    form.reset();
    await getEntries();

  } catch (error) {
    console.error('Virhe:', error);
  }
};

/////////////////////////////////////////////////
// Eventit
/////////////////////////////////////////////////

if (getEntriesButton) {
  getEntriesButton.addEventListener('click', getEntries);
}

if (form) {
  form.addEventListener('submit', addEntry);
}

export { getEntries };