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

    const nameCell = document.createElement("td");
    nameCell.textContent = user.name;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const infoCell = document.createElement("td");
    const infoButton = document.createElement("button");
    infoButton.textContent = "Info";

    infoButton.addEventListener("click", () => {
      alert(
        `ID: ${user.id}\nName: ${user.name}\nEmail: ${user.email}`
      );
    });

    infoCell.appendChild(infoButton);

    const idCell = document.createElement("td");
    idCell.textContent = user.id;

    row.appendChild(nameCell);
    row.appendChild(emailCell);
    row.appendChild(infoCell);
    row.appendChild(idCell);

    tableBody.appendChild(row);
  });
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

    // 🔧 NORMALISOINTI
    const users = response?.users || response?.data || response;

    if (!Array.isArray(users)) {
      console.error("API ei palauttanut taulukkoa:", response);
      return;
    }

    renderUsers(users);

  } catch (error) {
    console.error("Virhe haettaessa potilaita:", error);
  }
};

// EVENT LISTENER
getUsersButton.addEventListener("click", getUsers);