import { fetchData } from './fetch.js';

// Render Item in a List in the UI
/////////////////////
const renderFruitList = (items) => {
  console.log('Teen kohta listan');
  // Haetaan fruitlist UL
  const list = document.querySelector('.fruitlist');
  list.innerHTML = '';

  console.log(items);

  items.forEach((item) => {
    console.log(item.name);
    let li = document.createElement('li');
    li.textContent = `Hedelmän id ${item.id} ja nimi ${item.name}`;
    list.appendChild(li);
  });

  // ja lisätään loopissa kaikki yksittäiset
  // hedelmät listaan
};

// GEt items
/////////////////////

const getItems = async () => {
  //  const items = await fetchData(url, options);
  const items = await fetchData('http://localhost:3000/api/items');

  // jos BE puolelta tulee virhe niin informoidaan
  // joko consoleen tai käyttäjälle virheestä

  if (items.error) {
    console.log(items.error);
    return;
  }

  // tai jatketaan jä tehdään datalle jotain
  // items.forEach((item) => {
  //   console.log(item.name);
  // });

  renderFruitList(items);
};

// GEt item by ID
/////////////////////

const getItemById = async (event) => {
  console.log('Haetaan IDn avulla!!!');

  event.preventDefault();

  //const idInput = document.getElementById('itemID');
  const idInput = document.querySelector('#itemId');
  const itemId = idInput.value;
  console.log(itemId);

  const url = `http://localhost:3000/api/items/${itemId}`;

  const options = {
    method: 'GET',
  };

  const item = await fetchData(url, options);

  // jos BE puolelta tulee virhe niin informoidaan
  // joko consoleen tai käyttäjälle virheestä

  if (item.error) {
    console.log(item.error);
    return;
  }

  console.log(item);
  alert(`Item found :) ${item.name}`);
};

  const deleteItemById = async (event) => {
  console.log('Deletoidaan IDn avulla!!!');

  event.preventDefault();

  const idInput = document.querySelector('#itemId');
  const itemId = idInput.value;
  console.log(itemId);

  //Muista tarkistaa usein, että käyttäjä lähettää oikean datan
  if(!itemId) {
    console.log('Item ID missing, fill in the details')
    return;
  }

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

  await getItems();

  };

  //ADDitem
const addItem = async (event) => {

  event.preventDefault();

  // Haetaan formikentät
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

const updateItem = async (event) => {

  event.preventDefault();

  const idInput = document.querySelector('#putItemId');
  const nameInput = document.querySelector('#putItemName');

  const itemId = idInput.value;
  const newName = nameInput.value;

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

const getItemsTable = async () => {

  const items = await fetchData('http://localhost:3000/api/items');

  if (items.error) {
    console.log(items.error);
    return;
  }

  renderTable(items);

};

document.addEventListener('click', async (event) => {

  if (event.target.classList.contains('infoBtn')) {

    const id = event.target.dataset.id;

    const item = await fetchData(`http://localhost:3000/api/items/${id}`);

    alert(`Item: ${item.name}`);

  }

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

const addUser = async (event) => {

  event.preventDefault();

  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;
  const email = document.querySelector('#email').value;

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

export { getItems, getItemById, deleteItemById, addItem, updateItem, getItemsTable, addUser };
