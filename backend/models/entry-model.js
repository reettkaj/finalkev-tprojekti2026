// Note: db functions are async and must be called with await from the controller
// How to handle errors in controller?
import promisePool from '../utils/database.js';

// Päiväkirjamerkinnät
const listAllEntries = async () => {
  try {
    const [rows] = await promisePool.query('SELECT * FROM DiaryEntries');
    // sama sijoituslause perinteisemmin:
    //const result = await promisePool.query('SELECT * FROM DiaryEntries');
    //console.log('sql query result', result);
    //const rows = result[0];

    //console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// Hakee tietyn päiväkirjamerkinnän
const findEntryById = async (id) => {
  try {
    // prepared statement
    const [rows] = await promisePool.execute('SELECT * FROM DiaryEntries WHERE id = ?', [id]);


    //console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

// Uusi päiväkirjamerkintä
const addEntry = async (entry) => {

  const {
    user_id,
    created_at,
    weight,
    sleep,
    energy,
    stress,
    mood,
    symptoms,
    medication,
    notes
  } = entry;
  // SQL-lause uuden rivin lisäämiseksi
  // Käytetään placeholder-merkkejä (?) SQL-injektion estämiseksi
   const sql = `
    INSERT INTO DiaryEntries
    (user_id, created_at, weight, sleep, energy, stress, mood, symptoms, medication, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  // Parametrit samassa järjestyksessä kuin SQL-lauseessa
  const params = [
    user_id ?? null,
    created_at ?? null,
    weight ?? null,
    sleep ?? null,
    energy ?? null,
    stress ?? null,
    mood ?? null,
    symptoms ?? null,
    medication ?? null,
    notes ?? null,
  ];
  try {
    // Suoritetaan tietokantakysely
    const result = await promisePool.execute(sql, params);
    // Palautetaan lisätyn rivin id
    // insertId tulee MySQL:n vastauksesta
    return {entry_id: result[0].insertId};
  } catch (e) {
    // Jos tapahtuu virhe, tulostetaan se konsoliin
    console.error('error', e.message);
    // Palautetaan virhe controllerille käsiteltäväksi
    return {error: e.message};
  }
};

const listEntriesByUserId = async (id) => {
    const sql = `
    SELECT *
    FROM DiaryEntries
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
    try {
    // prepared statement
    const [rows] = await promisePool.execute(sql, [id]);

    // turvaton tapa, mahdollistaa sql-injektiohaavoittuvuuden:
    //const [rows] = await promisePool.query('SELECT * FROM DiaryEntries WHERE entry_id =' + id);

    //console.log('rows', rows);
    return rows;
  } catch (e) {
    console.error('error', e.message);
    return {error: e.message};
  }
};

export {listAllEntries, findEntryById, addEntry, listEntriesByUserId};

// ChatGPT:tä hyödynnettiin:
// - SELECT- ja INSERT-lauseiden kirjoittamisessa
// - Prepared statement -rakenteen käytössä SQL-injektion estämiseksi
// - Kyselyiden tulosten käsittelyssä