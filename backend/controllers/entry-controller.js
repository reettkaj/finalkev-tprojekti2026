import {listAllEntries, findEntryById, addEntry} from "../models/entry-model.js";

const getEntries = async (req, res) => {
  // Kutsutaan modelin funktiota, joka hakee kaikki merkinnät
  const result = await listAllEntries();

  // Jos ei virhettä, palautetaan tulos JSON-muodossa
  if (!result.error) {
    res.json(result);
  } else {
    // Jos tapahtuu virhe, palautetaan status 500
    res.status(500);
    res.json(result);
  }
};

const getEntryById = async (req, res) => {
  // Haetaan merkintä URL-parametrin id:n perusteella
  const entry = await findEntryById(req.params.id);

  if (entry) {
    // Jos merkintä löytyy, palautetaan se JSONina
    res.json(entry);
  } else {
    // Jos ei löydy, palautetaan 404 Not Found
    res.sendStatus(404);
  }
};

const postEntry = async (req, res) => {
  // Puretaan pyynnön body:sta tarvittavat kentät
  const {entry_date, mood, weight, sleep_hours, notes} = req.body;

  // user_id lisätään req-objektiin authenticateToken-middlewaresta
  const user_id = req.user.user_id;

  // Tarkistetaan että pakolliset tiedot löytyvät
  if (entry_date && (weight || mood || sleep_hours || notes) && user_id) {

    // Lisätään uusi merkintä tietokantaan
    const result = await addEntry({user_id, ...req.body});

    // Jos lisäys onnistui ja saatiin entry_id takaisin
    if (result.entry_id) {
      res.status(201);
      res.json({message: 'New entry added.', ...result});
    } else {
      // Jos tietokantavirhe
      res.status(500);
      res.json(result);
    }
  } else {
    // Jos validointi epäonnistuu, palautetaan 400 Bad Request
    res.sendStatus(400);
  }
};

const putEntry = (req, res) => {
  // placeholder for future implementation
  res.sendStatus(200);
};

const deleteEntry = (req, res) => {
  // placeholder for future implementation
  res.sendStatus(200);
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry};

// ChatGPT:tä hyödynnettiin:
// - Async controller -rakenteessa
// - Virheenkäsittelyn toteutuksessa
// - Pyyntöjen validoinnissa
// - Autentikoidun käyttäjän (req.user.user_id) yhdistämisessä tietokantaan