// Haetaan navbarista elementit
// .username = kohta johon näytetään käyttäjän nimi
// #authButtons = kohta johon lisätään login/logout nappi
const usernameSpan = document.querySelector(".username");
const authButtons = document.querySelector("#authButtons");

//  Tärkeä tarkistus:
// Kaikilla sivuilla ei ole näitä elementtejä (esim. index.html)
// Jos niitä ei ole → ei tehdä mitään, ettei koodi kaadu
if (!usernameSpan || !authButtons) {
  console.log("Navbar user elements not found on this page");

} else {

  // Haetaan localStoragesta käyttäjän tiedot
  // nämä tallennetaan kirjautumisen yhteydessä
  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");

  // jos käyttäjä on kirjautunut (sekä username että token löytyy)
  if (username && token) {

    // Näytetään käyttäjän nimi navbarissa
    usernameSpan.textContent = username;

    // Lisätään logout-nappi navbariin
    authButtons.innerHTML = `
      <button id="logoutBtn">Logout</button>
    `;

    // Kun logout-nappia klikataan
    document.querySelector("#logoutBtn").addEventListener("click", () => {

      // Poistetaan kaikki kirjautumistiedot selaimesta
      localStorage.removeItem("token");
      localStorage.removeItem("username");
      localStorage.removeItem("isNew");
      localStorage.removeItem("user_id");

      // Ohjataan käyttäjä takaisin kirjautumissivulle (index.html)
      window.location.href = "../index.html";
    });

  } else {

    //  Jos käyttäjä EI ole kirjautunut

    // Näytetään "Vieras"
    usernameSpan.textContent = "Vieras";

    // Näytetään login-nappi
    authButtons.innerHTML = `
      <a href="../index.html">
        <button>Login</button>
      </a>
    `;
  }
}