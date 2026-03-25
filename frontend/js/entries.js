import { fetchData } from './fetch.js';

// Container johon päiväkirjakortit lisätään
const diaryContainer = document.querySelector('.diary-card-area');

// nappi joka hakee merkinnät
const getEntriesButton = document.querySelector('.get_entries');

// form jolla lisätään uusi merkintä
const form = document.querySelector(".entry-form");


// Dialog
/////////////////////////////

const dialog = document.querySelector('.diary_dialog');
const closeButton = document.querySelector('.diary_dialog button');

// "Close" button closes the dialog, changed so that an eventlistener error won't occur
if (closeButton) {
  closeButton.addEventListener('click', () => {
    dialog.close();
  });
}


// Hae päiväkirjamerkinnät backendistä
///////////////////////////////////////
const getEntries = async () => {

  const url = 'http://localhost:3000/api/entries';

  let headers = {};
  let token = localStorage.getItem('token');

  console.log("TOKEN:", token);

  // jos token löytyy lisätään se requestiin
  if (token) {
    headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  const options = {
    headers: headers,
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error fetching entries:', response.error);
    return;
  }

  console.log("Entries response:", response);

  // Tyhjennetään vanhat kortit
  diaryContainer.innerHTML = '';

  // Jos ei merkintöjä
  if (!response || response.length === 0) {
    diaryContainer.innerHTML = "<p>Ei päiväkirjamerkintöjä.</p>";
    return;
  }

  // Luodaan kortit jokaisesta merkinnästä
  /////////////////////////////////////////
  response.forEach((entry) => {

    const card = document.createElement('div');
    card.classList.add('diary-card');

    const formattedDate = new Date(entry.entry_date).toLocaleDateString();

    card.innerHTML = `
    <img src="icone-sante-violet.png"
      class="diary-img">
      <h3>${formattedDate}</h3>

      <p>Mood: ${entry.mood}</p>
      <p>Weight: ${entry.weight} kg</p>
      <p>Sleep: ${entry.sleep_hours} h</p>

      <p>Energy: ${entry.energy_level}</p>
      <p>Water: ${entry.water_liters} L</p>
      <p>Stress: ${entry.stress_level}</p>

      <p>Exercise: ${entry.exercise ?? "-"}</p>
      <p>Meal: ${entry.meal ?? "-"}</p>
      <p>Symptom: ${entry.symptom ?? "-"}</p>
      <p>Medication: ${entry.medication ?? "-"}</p>

      <button class="open-btn">Avaa</button>
      <button class="delete-btn">Delete</button>
    `;
    const deleteBtn = card.querySelector('.delete-btn');
    const button = card.querySelector('.open-btn');

    // Päiväkirjamerkinnän poisto, ChatGPT auttoi
  deleteBtn.addEventListener('click', async () => {

    const confirmDelete = confirm("Oletko varma että haluat poistaa merkinnän?");
    if (!confirmDelete) return;

    try {

      const res = await fetch(`http://localhost:3000/api/entries/${entry.entry_id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (!res.ok) {
        throw new Error("Delete failed");
      }

      getEntries();

    } catch (err) {
      console.error("Delete error:", err);
    }
  });

    // Dialog joka näyttää tarkemmat tiedot
    button.addEventListener('click', () => {

      dialog.querySelector('.diary_id').innerHTML = `
        <p><strong>ID:</strong> ${entry.entry_id}</p>
        <p><strong>Notes:</strong> ${entry.notes}</p>
      `;

      dialog.showModal();
    });

    diaryContainer.appendChild(card);
  });

  };

// Lisää uusi päiväkirjamerkintä
////////////////////////////////
const addEntry = async (event) => {

  event.preventDefault();

  const formData = new FormData(form);

  const entry = {
  entry_date: formData.get("entry_date"),
  mood: formData.get("mood"),
  weight: formData.get("weight"),
  sleep_hours: formData.get("sleep_hours"),
  energy_level: formData.get("energy_level"),
  water_liters: formData.get("water_liters"),
  stress_level: formData.get("stress_level"),
  exercise: formData.get("exercise"),
  meal: formData.get("meal"),
  symptom: formData.get("symptom"),
  medication: formData.get("medication"),
  notes: formData.get("notes")
  };

  const token = localStorage.getItem("token");

  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(entry)
  };

  const response = await fetchData(
    "http://localhost:3000/api/entries",
    options
  );

  console.log("POST response:", response);

  // tyhjennetään form
  form.reset();

  // päivitetään lista
  getEntries();
};

// Event listenerit
////////////////////

// nappi joka hakee merkinnät, muokattu niin ettei tule eventlistener erroria selaimeen
if (getEntriesButton) {
  getEntriesButton.addEventListener("click", getEntries);
}

// form joka lisää merkinnän, sama eventlistener error prevention
if (form) {
  form.addEventListener("submit", addEntry);
}

// export jos tarvitaan muualla
export { getEntries };
