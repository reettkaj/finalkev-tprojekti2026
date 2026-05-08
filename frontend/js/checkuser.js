import { fetchData } from './fetch';

const API_BASE = "https://ptsdjahyvinvointiseurantasovellus.polandcentral.cloudapp.azure.com/api";

const saveUserId = async () => {
  const url = `${API_BASE}/users/me`;

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const options = {
    headers,
  };

  const data = await fetchData(url, options);

  if (data.error) {
    console.log('Käyttäjän tietojen haku epäonnistui');
    return;
  }

  const userId = data.userId;

  localStorage.setItem("user_id", userId);

  console.log("Tallennettu user_id:", userId);
};

const checkIfNewUser = async () => {
  const userId = localStorage.getItem('user_id');

  const url = `${API_BASE}/users/${userId}`;
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

export { saveUserId, checkIfNewUser };