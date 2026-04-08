import '../css/style.css';
import {fetchData} from './fetch.js';

// Endpoint
const url = 'https://127.0.0.1:3000';

const loginProfessional = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const ProfessionalLoginForm = document.querySelector('.ProfessionalLoginForm');

  // Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
  const email = ProfessionalLoginForm.querySelector('input[email=email]').value;
  const password = ProfessionalLoginForm.querySelector('input[name=password]').value;

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    email: email,
    password: password,
  };

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error adding a new user:', response.error);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('sähköposti', response.user.email);
    window.location.href = "./etusivu.html";
  }

  console.log(response);
  loginForm.reset(); // tyhjennetään formi
};

const loginPatient = async (event) => {
  event.preventDefault();

  // Haetaan oikea formi
  const patientloginForm = document.querySelector('.PatientloginForm');

  // Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
  const email = patientloginForm.querySelector('input[email=email]').value;
  const password = patientloginForm.querySelector('input[name=password]').value;

  // Luodaan body lähetystä varten taustapalvelun vaatimaan muotoon
  const bodyData = {
    email: email,
    password: password,
  };

  // Options
  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };
  console.log(options);

  // Hae data
  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error adding a new user:', response.error);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('sähköposti', response.user.email);
    window.location.href = "./etusivu.html";
  }

  console.log(response);
  loginForm.reset(); // tyhjennetään formi
};

const ProfessionalLoginForm = document.querySelector('.professionalLoginForm');
ProfessionalLoginForm.addEventListener('submit', loginProfessional);

const patientloginForm = document.querySelector('.patientloginForm');
patientloginForm.addEventListener('submit', loginPatient);
