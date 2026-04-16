import '../css/style.css';
import {fetchData} from './fetch.js';


const loginProfessional = async (event) => {
  // Endpoint
const url = 'http://127.0.0.1:3000/api/users/login/';

  event.preventDefault();

  // Haetaan oikea formi
  const ProfessionalLoginForm = document.querySelector('.ProfessionalLoginForm');

  // Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
  const email = ProfessionalLoginForm.querySelector('input[name=email]').value;
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
    console.error('Error login in:', response.error);
    return;
  }

  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.user.name);
    localStorage.setItem('user_id', response.user.user_id);
    localStorage.setItem('role_id', response.user.role_id);
    console.log('Token tallennettu:', response.token);
      // Ohjataan käyttäjä etusivulle
    setTimeout(function () {
      window.location.href = 'ammattilaissivut.html';
    }, 1000);
  }

  console.log(response);
  Form.reset(); // tyhjennetään formi
};

const loginPatient = async (event) => {
  // Endpoint
const url = 'http://127.0.0.1:3000/api/users/kubioslogin/';

  event.preventDefault();

  // Haetaan oikea formi
  const patientloginForm = document.querySelector('.PatientloginForm');

  // Haetaan formista arvot, tällä kertaa käyttäen attribuuutti selektoreita
  const email = patientloginForm.querySelector('input[name=email]').value;
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
    console.error('Error logging in:', response.error);
    return;
  }

     if (response.message) {
      const name = `${response.user.given_name} ${response.user.family_name}`;
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', name);
    console.log('Token tallennettu:', response.token);
      // Ohjataan käyttäjä etusivulle
    setTimeout(function () {
      window.location.href = 'etusivu.html';
    }, 1000);
  }
  

  console.log(response);
  Form.reset(); // tyhjennetään formi
};

const ProfessionalloginForm = document.querySelector('.ProfessionalLoginForm');
ProfessionalloginForm.addEventListener('submit', loginProfessional);

const patientloginForm = document.querySelector('.PatientloginForm');
patientloginForm.addEventListener('submit', loginPatient);
