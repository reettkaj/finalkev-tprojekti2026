import { fetchData } from "./fetch.js";

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

  // tärkeä
  addInfoListeners();
};

// FETCH DATA
const getUsers = async () => {
  if (!userId) return;

  try {
    const url = `http://localhost:3000/api/users/patients/${userId}`;

    const response = await fetchData(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

    // NORMALISOINTI
    const users = response?.users || response?.data || response;

    if (!Array.isArray(users)) {
      console.error("API ei palauttanut taulukkoa:", response);
      return;
    }

    renderUsers(users);
    console.log(users)

  } catch (error) {
    console.error("Virhe haettaessa potilaita:", error);
  }
};

const getPatientById = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`http://localhost:3000/api/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const getTSQByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(`http://localhost:3000/api/tsq/user/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

  const renderPatientDialog = (patient, tsqData, entries, kubiosData) => {
  const dialog = document.querySelector(".diary_dialog");
  const patientInfo = dialog.querySelector(".patient-info");
  const tsqInfo = dialog.querySelector(".tsq-info");

  console.log("TSQ DATA:", tsqData);

  patientInfo.innerHTML = `
    <p><strong>Nimi:</strong> ${patient.name}</p>
    <p><strong>Email:</strong> ${patient.email}</p>
  `;

  // FIX: pakota arrayksi
  const tsqArray = Array.isArray(tsqData)
    ? tsqData
    : tsqData
      ? [tsqData]
      : [];

  if (tsqArray.length === 0) {
    tsqInfo.innerHTML = "<p>Ei TSQ dataa</p>";
  } else {
    tsqInfo.innerHTML = tsqArray.map(entry => `
      <div class="tsq-entry">
        <p><strong>Traumaseulontakysenlyn Pisteet:</strong> ${entry.points}</p>
        <p><strong>Vastattu: </strong><small>${new Date(entry.created_at).toLocaleDateString("fi-FI")}</small></p>
      </div>
    `).join("");
  }

// Päiväkirjamerkinnät
const entryHtml =
  !entries || entries.length === 0
    ? "<p>Ei päiväkirjamerkintöjä</p>"
    : entries.map((entry, index) => {

        const date = new Date(
          entry.created_at || entry.entry_date
        ).toLocaleDateString("fi-FI");

        return `
          <div class="entry-card" data-index="${index}">

            <p>
              <strong>Päivämäärä:</strong> ${date}
            </p>

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

tsqInfo.addEventListener("click", (e) => {
  const btn = e.target.closest(".toggle-entry-btn");
  if (!btn) return;

  const card = btn.closest(".entry-card");
  const details = card.querySelector(".entry-details");

  const isHidden = details.classList.contains("hidden");

  details.classList.toggle("hidden");

  btn.textContent = isHidden
    ? "Piilota vastaukset"
    : "Näytä vastaukset";
});


const kubiosArray = Array.isArray(kubiosData)
  ? kubiosData
  : kubiosData?.results || [];

const latestKubios = kubiosArray[0];

if (latestKubios) {

const readiness =
  Math.round(latestKubios.readiness ?? 0);

const stress =
  Math.round(latestKubios.stress_index ?? 0);

  const readinessColor =
    readiness >= 80
      ? "green"
      : readiness >= 60
      ? "orange"
      : "red";

        const stressColor =
    stress <= 10
      ? "green"
      : stress <= 20
      ? "orange"
      : "red";

  tsqInfo.innerHTML += `
    <hr>

    <h3>HRV / Hyvinvointidata</h3>

    <p>
      <strong>Palautuminen:</strong>
      <span style="color:${readinessColor}">
        ${readiness}
      </span>
    </p>

    <p>
      <span style="color:${stressColor}">
      ${stress}
      </span>
    </p>
  `;
}

  dialog.showModal();
};

const addInfoListeners = () => {
  const buttons = document.querySelectorAll(".info-btn");

  buttons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const userId = e.target.dataset.id;

      const dialog = document.querySelector(".diary_dialog");
      const patientInfo = dialog.querySelector(".patient-info");
      const tsqInfo = dialog.querySelector(".tsq-info");

      // loading state
      patientInfo.innerHTML = "<p>Ladataan...</p>";
      tsqInfo.innerHTML = "";
      dialog.showModal();

      try {
        const patient = await getPatientById(userId);
        const tsqData = await getTSQByUserId(userId);
        const entries = await getEntriesByUserId(userId);

        const kubiosData =
          await getKubiosDataByUserId(userId);

        if (!patient || patient.error) {
          patientInfo.innerHTML = "<p>Virhe potilaan haussa</p>";
          return;
        }

        renderPatientDialog(patient, tsqData, entries, kubiosData);

      } catch (error) {
        console.error(error);
        patientInfo.innerHTML = "<p>Virhe haussa</p>";
      }
    });
  });
};

const initDialog = () => {
  const dialog = document.querySelector(".diary_dialog");
  const closeBtn = document.getElementById("close-dialog");

  if (!dialog || !closeBtn) return;

  closeBtn.addEventListener("click", () => {
    dialog.close();
  });
};

document.addEventListener("DOMContentLoaded", initDialog);

// EVENT LISTENER
if (getUsersButton) {
  getUsersButton.addEventListener("click", getUsers);
}

const getEntriesByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(
    `http://localhost:3000/api/entries/user/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

const getKubiosDataByUserId = async (id) => {
  const token = localStorage.getItem("token");

  return await fetchData(
    `http://localhost:3000/api/kubios/user-data/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

console.log("PATIENT:", patient);
console.log("KUBIOS:", kubiosData);