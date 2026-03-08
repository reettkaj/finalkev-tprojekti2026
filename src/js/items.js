import { fetchData } from './fetch.js';

// ============================
// Renderöi hedelmälistan UI:hin
// ============================

const renderFruitList = (items) => {

  console.log('Teen kohta listan');

  // Haetaan UL elementti johon lista renderöidään
  const list = document.querySelector('.fruitlist');

  // Tyhjennetään lista ennen uusien lisäämistä
  list.innerHTML = '';

  console.log(items);

  // Loopataan kaikki items
  items.forEach((item) => {

    console.log(item.name);

    // Luodaan uusi listaelementti
    let li = document.createElement('li');

    // Lisätään teksti
    li.textContent = `Hedelmän id ${item.id} ja nimi ${item.name}`;

    // Lisätään listaan
    list.appendChild(li);

  });

};

// ============================
// GET kaikki items
// ============================

const getItems = async () => {

  // Haetaan kaikki items backendistä
  const items = await fetchData('http://localhost:3000/api/items');

  // Jos backend palauttaa virheen
  if (items.error) {
    console.log(items.error);
    return;
  }

  // Renderöidään lista
  renderFruitList(items);

};

// ============================
// GET item ID:n perusteella
// ============================

const getItemById = async (event) => {

  console.log('Haetaan IDn avulla!!!');

  event.preventDefault();

  // Haetaan input kenttä
  const idInput = document.querySelector('#itemId');

  const itemId = idInput.value;

  console.log(itemId);

  const url = `http://localhost:3000/api/items/${itemId}`;

  const options = {
    method: 'GET',
  };

  const item = await fetchData(url, options);

  // Virhe backendistä
  if (item.error) {
    console.log(item.error);
    return;
  }

  console.log(item);

  alert(`Item found :) ${item.name}`);

};

// ============================
// DELETE item ID:n perusteella
// ============================

const deleteItemById = async (event) => {

  console.log('Deletoidaan IDn avulla!!!');

  event.preventDefault();

  const idInput = document.querySelector('#itemId');

  const itemId = idInput.value;

  console.log(itemId);

  // Tarkistus että ID on annettu
  if(!itemId) {
    console.log('Item ID missing, fill in the details')
    return;
  }

  // Varmistus käyttäjältä
  const confirmed = confirm(`Oletko varma että haluat poistaa itemin: ${itemId}`);

  if (!confirmed) return;

  const url = `http://localhost:3000/api/items/${itemId}`;

  const options = {
    method: 'DELETE',
  };

  const item = await fetchData(url, options);

  if (item.error) {
    alert(item.error);
    return;
  }

  console.log(item);

  alert(item.message);

  // Päivitetään lista
  await getItems();

};

// ============================
// ADD item
// ============================

const addItem = async (event) => {

  event.preventDefault();

  // Haetaan form inputit
  const nameInput = document.querySelector('#newItemName');
  const weightInput = document.querySelector('#newItemWeight');

  const name = nameInput.value;
  const weight = weightInput.value;

  // Tarkistus
  if (!name) {
    alert('Anna nimi');
    return;
  }

  const url = 'http://localhost:3000/api/items';

  const options = {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      name: name,
      weight: weight
    })

  };

  const result = await fetchData(url, options);

  if (result.error) {
    console.log(result.error);
    return;
  }

  console.log(result);

  alert(result.message);

  // Päivitetään lista
  await getItems();

};

// ============================
// UPDATE item
// ============================

const updateItem = async (event) => {

  event.preventDefault();

  const idInput = document.querySelector('#putItemId');
  const nameInput = document.querySelector('#putItemName');

  const itemId = idInput.value;
  const newName = nameInput.value;

  // Tarkistus
  if (!itemId || !newName) {
    alert('Täytä tiedot');
    return;
  }

  const url = `http://localhost:3000/api/items/${itemId}`;

  const options = {

    method: 'PUT',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      name: newName
    })

  };

  const result = await fetchData(url, options);

  if (result.error) {
    alert(result.error);
    return;
  }

  alert(result.message);

  await getItems();

};

// ============================
// Renderöi items taulukkoon
// ============================

const renderTable = (items) => {

  const tbody = document.querySelector('.tbody');

  tbody.innerHTML = '';

  items.forEach(item => {

    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>${item.name}</td>
      <td><button class="infoBtn" data-id="${item.id}">Info</button></td>
      <td><button class="deleteBtn" data-id="${item.id}">Delete</button></td>
      <td>${item.id}</td>
    `;

    tbody.appendChild(tr);

  });

};

// ============================
// GET items taulukkoon
// ============================

const getItemsTable = async () => {

  const items = await fetchData('http://localhost:3000/api/items');

  if (items.error) {
    console.log(items.error);
    return;
  }

  renderTable(items);

};

// ============================
// Event delegation napeille
// ============================

document.addEventListener('click', async (event) => {

  // Info nappi
  if (event.target.classList.contains('infoBtn')) {

    const id = event.target.dataset.id;

    const item = await fetchData(`http://localhost:3000/api/items/${id}`);

    alert(`Item: ${item.name}`);

  }

  // Delete nappi
  if (event.target.classList.contains('deleteBtn')) {

    const id = event.target.dataset.id;

    const confirmed = confirm('Poistetaanko?');

    if (!confirmed) return;

    await fetchData(`http://localhost:3000/api/items/${id}`, {
      method: 'DELETE'
    });

    await getItemsTable();

  }

});

// ============================
// ADD user
// ============================

const addUser = async (event) => {

  event.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;

  // Tarkistus
  if (!username || !password || !email) {
    alert('Täytä kaikki kentät');
    return;
  }

  const url = 'http://localhost:3000/api/users';

  const options = {

    method: 'POST',

    headers: {
      'Content-Type': 'application/json'
    },

    body: JSON.stringify({
      username: username,
      password: password,
      email: email
    })

  };

  const result = await fetchData(url, options);

  if (result.error) {
    alert(result.error);
    return;
  }

  alert('User lisätty onnistuneesti');

  document.querySelector('.addform').reset();

};

// Exportataan funktiot muihin tiedostoihin
export {
  getItems,
  getItemById,
  deleteItemById,
  addItem,
  updateItem,
  getItemsTable,
  addUser
};