import '../css/api.css';
import { fetchData } from './fetch.js';

// Debug viesti konsoliin
console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

// Esimerkin takia haut ovat nyt suoraan tässä tiedostossa,
// jotta harjoitus ei sekoita projektin rakennetta

// ============================
// USER REGISTER
// ============================

const registerUser = async (event) => {

  // Estetään form submit reload
  event.preventDefault();

  // Haetaan form elementti
  const registerForm = document.querySelector(".registerForm");

  // Haetaan input arvot ja poistetaan tyhjät välit
  const username = registerForm.username.value.trim();
  const password = registerForm.password.value.trim();
  const email = registerForm.email.value.trim();

  // Muodostetaan body data
  const bodyData = {
    username: username,
    password: password,
    email: email,
  };

  // Backend endpoint
  const url = "http://localhost:3000/api/users";

  // Fetch asetukset
  const options = {
    body: JSON.stringify(bodyData),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Lähetetään request backendille
  const response = await fetchData(url, options);

  // Jos virhe backendistä
  if (response.error) {
    console.error("Error adding a new user:", response.error);
    return;
  }

  // Onnistunut rekisteröinti
  alert("Käyttäjän rekisteröinti onnistunut!");

  console.log("User created:", response);

  // Tyhjennetään form
  registerForm.reset();

};

// ============================
// USER LOGIN
// ============================

const loginUser = async (event) => {

  event.preventDefault();

  const loginForm = document.querySelector('.loginForm');

  // Haetaan käyttäjän syöttämät tiedot
  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  // Request body
  const bodyData = {
    username: username,
    password: password,
  };

  const url = 'http://localhost:3000/api/users/login';

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  console.log(options);

  // Lähetetään login request
  const response = await fetchData(url, options);

  // Virhe
  if (response.error) {
    console.error('Error login in:', response.error);
    return;
  }

  // Jos token saadaan backendistä
  if (response.token) {

    // Tallennetaan token localStorageen
    localStorage.setItem('token', response.token);

    // Tallennetaan username
    localStorage.setItem('username', username);

    console.log('Token tallennettu:', response.token);

    // Ohjataan käyttäjä etusivulle
    setTimeout(function () {
      window.location.href = 'index.html';
    }, 1000);

  }

  console.log(response);

  loginForm.reset();

};

// ============================
// CHECK AUTHORIZED USER
// ============================

const checkUser = async (event) => {

  const url = 'http://localhost:3000/api/users/me';

  let headers = {};

  // Haetaan token localStoragesta
  let token = localStorage.getItem('token');

  console.log(token);

  // Jos token löytyy lisätään Authorization header
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
    console.error('Error login in:', response.error);
    return;
  }

  if (response.message) {

    console.log(response.message, 'success');

    logResponse(
      'meResponse',
      `Authorized user info: ${JSON.stringify(response)}`
    );

  }

  console.log(response);

  loginForm.reset();

};

// ============================
// DELETE USER
// ============================

const deleteUser = async (event) => {

  console.log(event);
  console.log(event.target);

  const id = event.target.attributes['data-id'].value;

  const url = `http://localhost/api/users/${id}`;

  const options = { method: 'DELETE' };

  const answer = confirm(`Are you sure you want to delete user with ID: ${id}`);

  if (answer) {

    try {

      const response = await fetch(url, options);

      console.log(response);

      getAllUsers();

    } catch (error) {

      console.error(error);

    }

  }

};

// ============================
// CLEAR LOCAL STORAGE
// ============================

function clearLocalStorage() {

  localStorage.removeItem('token');
  localStorage.removeItem('name');

  logResponse('clearResponse', 'localStorage cleared!');

}

// ============================
// PRINT RESPONSE UI
// ============================

function logResponse(codeblock, text) {

  document.getElementById(codeblock).innerText = text;

}

// ============================
// EVENT LISTENERS
// ============================

const registerForm = document.querySelector('.registerForm');

registerForm.addEventListener('submit', registerUser);

const loginForm = document.querySelector('.loginForm');

loginForm.addEventListener('submit', loginUser);

const meRequest = document.querySelector('#meRequest');

meRequest.addEventListener('click', checkUser);

const clear = document.querySelector('#clearButton');

clear.addEventListener('click', clearLocalStorage);

// ============================
// USER AREA UI
// ============================

// Haetaan tallennettu username ja token
const username = localStorage.getItem('username');

const token = localStorage.getItem('token');

// Haetaan userArea elementti
const userArea = document.querySelector('#userArea');

if (userArea) {

  // Jos käyttäjä on kirjautunut
  if (token && username) {

    userArea.innerHTML = `
      Hei ${username}
      <button id="logoutBtn">Logout</button>
    `;

    // Logout nappi
    document.querySelector('#logoutBtn').addEventListener('click', () => {

      localStorage.removeItem('token');
      localStorage.removeItem('username');

      location.reload();

    });

  } else {

    // Jos ei kirjautunut
    userArea.innerHTML = `<a href="login.html">Kirjaudu</a>`;

  }

}