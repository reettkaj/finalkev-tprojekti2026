import { fetchData } from './fetch.js';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

// Käyttäjän rekisteröinti
const addUser = async (event) => {
  event.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;

  const url = `${API_BASE}/users`;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password,
      email
    })
  };

  const result = await fetchData(url, options);

  console.log(result);

  if (result.error) {
    alert(result.error);
    return;
  }

  alert("User added!");
};

export { addUser };