import '../css/style.css';
import { fetchData } from './fetch.js';
import { saveUserId, checkIfNewUser } from './checkuser.js';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const loginProfessional = async (event) => {
  const url = `${API_BASE}/users/login/`;

  event.preventDefault();

  const ProfessionalLoginForm = document.querySelector('.ProfessionalLoginForm');

  const email = ProfessionalLoginForm.querySelector('input[name=email]').value;
  const password = ProfessionalLoginForm.querySelector('input[name=password]').value;

  const bodyData = {
    email,
    password,
  };

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

  if (response.message) {
    console.log(response.message, 'success');
    localStorage.setItem('token', response.token);
    localStorage.setItem('username', response.user.name);
    localStorage.setItem('user_id', response.user.user_id);
    localStorage.setItem('role_id', response.user.role_id);

    setTimeout(() => {
      window.location.href = 'ammattilaissivut.html';
    }, 1000);
  }

  console.log(response);
  ProfessionalLoginForm.reset();
};

const loginPatient = async (event) => {
  const url = `${API_BASE}/users/kubioslogin/`;

  event.preventDefault();

  const patientloginForm = document.querySelector('.PatientloginForm');

  const email = patientloginForm.querySelector('input[name=email]').value;
  const password = patientloginForm.querySelector('input[name=password]').value;

  const bodyData = {
    email,
    password,
  };

  const options = {
    body: JSON.stringify(bodyData),
    method: 'POST',
    headers: {
      'Content-type': 'application/json',
    },
  };

  const response = await fetchData(url, options);

  if (response.error) {
    console.error('Error logging in:', response.error);
    return;
  }

  if (response.message) {
    const name = `${response.user.given_name} ${response.user.family_name}`;

    console.log(response.message, 'success');
    console.log('user', response.user);

    localStorage.setItem('token', response.token);
    localStorage.setItem('username', name);

    await saveUserId();
    await checkIfNewUser();

    setTimeout(() => {
      window.location.href = 'etusivu.html';
    }, 1000);
  }

  console.log(response);
  patientloginForm.reset();
};

const ProfessionalloginForm = document.querySelector('.ProfessionalLoginForm');
ProfessionalloginForm.addEventListener('submit', loginProfessional);

const patientloginForm = document.querySelector('.PatientloginForm');
patientloginForm.addEventListener('submit', loginPatient);