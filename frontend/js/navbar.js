// Haetaan navbarista elementit
// username span näyttää käyttäjän nimen
// authButtons on kohta johon lisätään login/logout nappi

const usernameSpan = document.querySelector(".username");
const authButtons = document.querySelector("#authButtons");


// Haetaan localStoragesta käyttäjän tiedot
// nämä tallennetaan loginin yhteydessä

const username = localStorage.getItem("username");
const token = localStorage.getItem("token");


// Jos käyttäjä on kirjautunut (token + username löytyy)

if (username && token) {

  // näytetään käyttäjän nimi navbarissa
  usernameSpan.textContent = username;

  // lisätään logout nappi
  authButtons.innerHTML = `
    <button id="logoutBtn">Logout</button>
  `;

  // logout toiminto
  document.querySelector("#logoutBtn").addEventListener("click", () => {

    // poistetaan kirjautumistiedot
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem('isNew');
    localStorage.removeItem('user_id');

    // ohjataan takaisin etusivulle
    window.location.href = "../index.html";

  });

} else {

  // jos käyttäjä ei ole kirjautunut

  // näytetään vieras
  usernameSpan.textContent = "Vieras";

  // näytetään login nappi
  authButtons.innerHTML = `
    <a href="../login.html">
      <button>Login</button>
    </a>
  `;

}