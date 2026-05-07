import { fetchData } from './fetch.js';

// Container johon päiväkirjakortit lisätään
const diaryContainer = document.querySelector('.diary-card-area');

// Nappi joka hakee merkinnät
const getEntriesButton = document.querySelector('.get_entries');

// Form jolla lisätään / muokataan merkintä
const form = document.querySelector('.entry-form');

// Tallennetaan muokattavan merkinnän id
let editingEntryId = null;

/////////////////////////////////////////////////
// Dialog
/////////////////////////////////////////////////

const dialog = document.querySelector('.diary_dialog');
const closeButton = document.querySelector('.diary_dialog button');

// Sulje dialogi
if (closeButton) {
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
}

/////////////////////////////////////////////////
// Hae päiväkirjamerkinnät backendistä
/////////////////////////////////////////////////

const getEntries = async () => {
  const userId = localStorage.getItem('user_id');

  if (!userId) {
    console.error('user_id puuttuu');
    return;
  }

  const token = localStorage.getItem('token');

  const url = `http://localhost:3000/api/entries/user/${userId}`;

  const response = await fetchData(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response || response.error) {
    console.error('Virhe merkintöjen haussa:', response?.error);
    return;
  }

  // Tyhjennetään container ennen uusien korttien renderöintiä
  diaryContainer.innerHTML = '';

  // Jos ei merkintöjä
  if (response.length === 0) {
    diaryContainer.innerHTML = '<p>Ei päiväkirjamerkintöjä.</p>';
    return;
  }

  console.log('RAW RESPONSE:', response);

  response.forEach((entry) => {
    const card = document.createElement('div');
    card.classList.add('diary-card');

    const formattedDate = new Date(
      entry.created_at
    ).toLocaleDateString();

    // Kortin sisältö
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

    //////////////////////////////////////////////////
    // DELETE
    //////////////////////////////////////////////////

    const deleteBtn = card.querySelector('.delete-btn');

    deleteBtn.addEventListener('click', async () => {
      const confirmDelete = confirm(
        'Poistetaanko merkintä?'
      );

      if (!confirmDelete) return;

      try {
        const response = await fetchData(
          `http://localhost:3000/api/entries/${entry.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Poistettu:', response);

        // Päivitä lista
        await getEntries();

      } catch (error) {
        console.error('Poistovirhe:', error);
      }
    });

    //////////////////////////////////////////////////
    // EDIT
    //////////////////////////////////////////////////

    const editBtn = card.querySelector('.edit-btn');

    editBtn.addEventListener('click', () => {

  console.log("EDIT ENTRY:", entry);

  // Tallennetaan muokattava id
  editingEntryId = entry.id;

  // Täytetään formi vanhoilla tiedoilla
  form.querySelector('[name="entry_date"]').value =
    new Date(entry.created_at)
      .toISOString()
      .split('T')[0];

  form.querySelector('[name="weight"]').value =
    entry.weight ?? '';

  form.querySelector('[name="sleep_hours"]').value =
    entry.sleep ?? '';

  form.querySelector('[name="energy_level"]').value =
    entry.energy ?? '';

  form.querySelector('[name="stress_level"]').value =
    entry.stress ?? '';

  form.querySelector('[name="mood"]').value =
    entry.mood ?? '';

  form.querySelector('[name="symptom"]').value =
    entry.symptoms ?? '';

  form.querySelector('[name="medication"]').value =
    entry.medication ?? '';

  form.querySelector('[name="notes"]').value =
    entry.notes ?? '';

  // Scrollataan formiin
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
});

    // Lisää kortti sivulle
    diaryContainer.appendChild(card);
  });
};

/////////////////////////////////////////////////
// Lisää / muokkaa päiväkirjamerkintä
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

    // Jos muokataan -> PUT
    // Muuten -> POST
    const url = editingEntryId
      ? `http://localhost:3000/api/entries/${editingEntryId}`
      : 'http://localhost:3000/api/entries';

    const method = editingEntryId
      ? 'PUT'
      : 'POST';

    const response = await fetchData(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(entry),
    });

    if (!response || response.error) {
      console.error(
        'Tallennus epäonnistui:',
        response
      );

      alert('Merkinnän tallennus epäonnistui');

      return;
    }

    console.log('Tallennettu:', response);

    // Resetoi edit-mode
    editingEntryId = null;

    // Tyhjennä form
    form.reset();

    // Päivitä lista
    await getEntries();

  } catch (error) {
    console.error('Virhe:', error);
  }
};

/////////////////////////////////////////////////
// Event listenerit
/////////////////////////////////////////////////

// Hae merkinnät
if (getEntriesButton) {
  getEntriesButton.addEventListener(
    'click',
    getEntries
  );
}

// Lisää / muokkaa merkintä
if (form) {
  form.addEventListener(
    'submit',
    addEntry
  );
}

// Export jos tarvitaan muualla
export { getEntries };