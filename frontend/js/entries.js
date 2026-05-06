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
  const userId = localStorage.getItem("user_id");

  if (!userId) {
    console.error("user_id puuttuu");
    return;
  }

  const url = `http://localhost:3000/api/entries/user/${userId}`;

  const token = localStorage.getItem("token");

  const response = await fetchData(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response || response.error) {
    console.error("Error fetching entries:", response?.error);
    return;
  }

  diaryContainer.innerHTML = '';

  if (response.length === 0) {
    diaryContainer.innerHTML = "<p>Ei päiväkirjamerkintöjä.</p>";
    return;
  }
  console.log("RAW RESPONSE:", response);
  response.forEach((entry) => {
    const card = document.createElement('div');
    card.classList.add('diary-card');

    const formattedDate = new Date(entry.created_at).toLocaleDateString();

    card.innerHTML = `
      <h3>${formattedDate}</h3>

      <p>Mood: ${entry.mood}</p>
      <p>Weight: ${entry.weight} kg</p>
      <p>Sleep: ${entry.sleep} h</p>

      <p>Energy: ${entry.energy ?? "-"}</p>
      <p>Stress: ${entry.stress ?? "-"}</p>

      <p>Symptom: ${entry.symptoms ?? "-"}</p>
      <p>Medication: ${entry.medication ?? "-"}</p>
    `;

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
    weight: parseFloat(formData.get("weight")),
    sleep_hours: parseFloat(formData.get("sleep_hours")),
    energy_level: formData.get("energy_level")
      ? parseInt(formData.get("energy_level"))
      : null,
    stress_level: formData.get("stress_level")
      ? parseInt(formData.get("stress_level"))
      : null,
    mood: formData.get("mood"),
    symptom: formData.get("symptom") || null,
    medication: formData.get("medication") || null,
    notes: formData.get("notes") || null,
  };

  const token = localStorage.getItem("token");

  if (!token) {
    console.error("Token puuttuu");
    return;
  }

  try {
    const response = await fetchData(
      "http://localhost:3000/api/entries",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(entry),
      }
    );

    if (!response || response.error) {
      console.error("Tallennus epäonnistui:", response);
      alert("Merkinnän tallennus epäonnistui");
      return;
    }

    console.log("Tallennettu:", response);

    //form.reset();
    //await getEntries();

  } catch (error) {
    console.error("Virhe:", error);
  }
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
