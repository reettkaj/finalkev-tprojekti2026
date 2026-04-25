import { fetchData } from './fetch';

const saveUserId = async() => {

    const url = 'http://localhost:3000/api/users/me';
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    const options = {
        headers: headers,
    };
  const data = await fetchData(url, options);
  if (data.error) {
    console.log('Käyttäjän tietojen haku epäonnistui');
    return;
  }
  const userId = data.userId;

  // kriittinen rivi
  localStorage.setItem("user_id", userId);

  console.log("Tallennettu user_id:", userId);
};

const checkIfNewUser = async() => {
    const userId = localStorage.getItem('user_id');

    const url = `http://localhost:3000/api/users/${userId}`;
    const data = await fetchData(url);
        if (data.error) {
            console.log('Käyttäjän tietojen haku epäonnistui');
            return;
        }
        const isNew = data.isNew;

  if (typeof isNew === "undefined") {
    console.error("isNew puuttuu vastauksesta:", data);
    return;
  }

  localStorage.setItem("isNew", isNew);

  console.log("isNew tallennettu:", isNew);
};

export {saveUserId,checkIfNewUser};