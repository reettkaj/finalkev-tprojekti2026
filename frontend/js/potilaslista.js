import { fetchData } from "./fetch.js";

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const tableBody = document.querySelector("#taulukko");
const getUsersButton = document.querySelector(".get_users");

const userId = localStorage.getItem("user_id");

if (!userId) {
  console.error("user_id puuttuu localStoragesta");
}

// RENDER TAULUKKO
const renderUsers = (users) => {
  tableBody.innerHTML = "";

  if (!users || users.length === 0) {
    const row = document.createElement("tr");
    row.innerHTML = `<td colspan="4">Ei potilaita</td>`;
    tableBody.appendChild(row);
    return;
  }

  users.forEach((user) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>${user.name}</td>
      <td>
        <button class="info-btn" data-id="${user.user_id}">
          Avaa tiedot
        </button>
      </td>
    `;

    tableBody.appendChild(row);
  });

  addInfoListeners();
};

// FETCH DATA
const getUsers = async () => {
  if (!userId) return;

  try {
    const url = `${API_BASE}/users/patients/${userId}`;

    const response = await fetchData(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    const users = response?.users || response?.data || response;

    if (!Array.isArray(users)) {
      console.error("API ei palauttanut taulukkoa:", response);
      return;
    }

    renderUsers(users);
    console.log(users);

  } catch (error) {
    console.error("Virhe haettaessa potilaita:", error);
  }
};

const getPatientById = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getTSQByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/tsq/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getTSQAnswersByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/tsq/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================
// PATIENT / TSQ / ENTRY VIEW
// ============================

const renderPatientDialog = (patient, tsqData, entries, kubiosData) => {
  const dialog = document.querySelector(".diary_dialog");
  const patientInfo = dialog.querySelector(".patient-info");
  const tsqInfo = dialog.querySelector(".tsq-info");

  patientInfo.innerHTML = `
    <p><strong>Nimi:</strong> ${patient.name}</p>
    <p><strong>Sähköposti:</strong> ${patient.email}</p>
  `;

  const tsqArray = Array.isArray(tsqData)
    ? tsqData
    : tsqData
      ? [tsqData]
      : [];

  if (tsqArray.length === 0) {
    tsqInfo.innerHTML = "<p>Ei TSQ dataa</p>";
  } else {
    tsqInfo.innerHTML = tsqArray.map((entry, index) => `
      <div class="tsq-entry">
        <p><strong>Traumaseulontakyselyn pisteet:</strong> ${entry.points}</p>
        <p><strong>Vastattu:</strong> <small>${new Date(entry.created_at).toLocaleDateString("fi-FI")}</small></p>

        <button class="toggle-tsq-btn" data-id="${entry.id}" data-index="${index}">
          Näytä TSQ-vastaukset
        </button>

        <div class="tsq-answers hidden"></div>
        <hr>
      </div>
    `).join("");
  }

  const entryHtml =
    !entries || entries.length === 0
      ? "<p>Ei päiväkirjamerkintöjä</p>"
      : entries.map((entry, index) => {
          const date = new Date(entry.created_at || entry.entry_date)
            .toLocaleDateString("fi-FI");

          return `
            <div class="entry-card" data-index="${index}">
              <p><strong>Päivämäärä:</strong> ${date}</p>

              <button class="toggle-entry-btn" data-index="${index}">
                Näytä vastaukset
              </button>

              <div class="entry-details hidden">
                <p><strong>Paino:</strong> ${entry.weight ?? "-"}</p>
                <p><strong>Uni:</strong> ${entry.sleep ?? "-"}</p>
                <p><strong>Energia:</strong> ${entry.energy ?? "-"}</p>
                <p><strong>Stressi:</strong> ${entry.stress ?? "-"}</p>
                <p><strong>Mieliala:</strong> ${entry.mood ?? "-"}</p>
                <p><strong>Oireet:</strong> ${entry.symptoms ?? "-"}</p>
                <p><strong>Lääkitys:</strong> ${entry.medication ?? "-"}</p>
                <p><strong>Muistiinpanot:</strong> ${entry.notes ?? "-"}</p>
              </div>

              <hr>
            </div>
          `;
        }).join("");

  tsqInfo.innerHTML += `
    <hr>
    <h3>Päiväkirjamerkinnät</h3>
    ${entryHtml}
  `;

  dialog.showModal();
};

// ============================
// PATIENT LIST ACTIONS
// ============================

const getAllPatients = async () => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/users/patients`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const addPatientToDoctor = async (patientId) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/users/patients/${patientId}/doctor`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
};

const getEntriesByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/entries/user/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

const getKubiosDataByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`${API_BASE}/kubios/user-data/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// ============================
// USER LIST EVENTS
// ============================

if (getUsersButton) {
  getUsersButton.addEventListener("click", getUsers);
}