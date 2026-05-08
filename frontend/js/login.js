import '../css/api.css';
import { fetchData } from './fetch.js';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

console.log('Moi luodaan nyt tokeneita ja kirjaudutaan sisään');

// ============================
// USER REGISTER
// ============================

const registerUser = async (event) => {
  event.preventDefault();

  const registerForm = document.querySelector(".registerForm");

  const username = registerForm.username.value.trim();
  const password = registerForm.password.value.trim();
  const email = registerForm.email.value.trim();

  const bodyData = { username, password, email };

  const url = `${API_BASE}/users`;

  const options = {
    body: JSON.stringify(bodyData),
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error("Error adding a new user:", response.error);
    return;
  }

  alert("Käyttäjän rekisteröinti onnistunut!");
  console.log("User created:", response);

  registerForm.reset();
};

// ============================
// USER LOGIN
// ============================

const loginUser = async (event) => {
  event.preventDefault();

  const loginForm = document.querySelector('.loginForm');

  const username = loginForm.querySelector('input[name=username]').value;
  const password = loginForm.querySelector('input[name=password]').value;

  const bodyData = { username, password };

  const url = `${API_BASE}/users/login`;

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error login in:', response.error);
    return;
  }

  if (response.token) {
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', username);

    console.log('Token tallennettu:', response.token);

    setTimeout(() => {
      window.location.href = 'index.html';
    }, 1000);
  }

  console.log(response);
  loginForm.reset();
};

// ============================
// CHECK AUTHORIZED USER
// ============================

const checkUser = async () => {
  const url = `${API_BASE}/users/me`;

  let token = localStorage.getItem('token');

  const headers = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  const options = { headers };

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
};

// ============================
// DELETE USER
// ============================

const deleteUser = async (event) => {
  const id = event.target.attributes['data-id'].value;

  const url = `${API_BASE}/users/${id}`;

  const options = { method: 'DELETE' };

  const answer = confirm(`Are you sure you want to delete user with ID: ${id}`);

  if (!answer) return;

  try {
    const response = await fetch(url, options);
    console.log(response);

    getAllUsers(); // oletetaan että tämä on muualla
  } catch (error) {
    console.error(error);
  }
};

// ============================
// CLEAR LOCAL STORAGE
// ============================

function clearLocalStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('name');
  localStorage.removeItem('isNew');
  localStorage.removeItem('user_id');

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

const username = localStorage.getItem('username');
const token = localStorage.getItem('token');

const userArea = document.querySelector('#userArea');

if (userArea) {
  if (token && username) {
    userArea.innerHTML = `
      Hei ${username}
      <button id="logoutBtn">Logout</button>
    `;

    document.querySelector('#logoutBtn').addEventListener('click', () => {
      localStorage.clear();
      location.reload();
    });

  } else {
    userArea.innerHTML = `<a href="index.html">Kirjaudu</a>`;
  }
}