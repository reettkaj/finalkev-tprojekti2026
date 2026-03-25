import { fetchData } from './fetch.js';
// Käyttäjän rekisteröinti
const addUser = async (event) => {

  event.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;

  const url = 'http://localhost:3000/api/users';

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

  if(result.error){
    alert(result.error);
    return;
  }
// Ilmoittaa rekisteröidystä käyttäjästä
  alert("User added!");
};

export { addUser };