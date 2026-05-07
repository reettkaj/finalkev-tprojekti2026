// Haetaan elementit
const usernameSpan = document.querySelector(".username");
const logoutBtn = document.querySelector("#logout");

// Haetaan käyttäjän nimi localStoragesta
const username = localStorage.getItem("username");

// Jos username elementti löytyy
if (usernameSpan) {

  // Jos käyttäjä on kirjautunut
  if (username) {
    usernameSpan.textContent = username;

    // logout toimii vain jos nappi löytyy
    if (logoutBtn) {
      logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem('isNew');
        localStorage.removeItem('user_id');

        window.location.href = "index.html";
      });
    }

  } else {

    // jos ei kirjautunut
    usernameSpan.textContent = "Vieras";

    // piilotetaan logout nappi jos se on olemassa
    if (logoutBtn) {
      logoutBtn.style.display = "none";
    }

  }

}