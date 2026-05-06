import {listAllEntries, findEntryById, addEntry, listEntriesByUserId} from "../models/entry-model.js";

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
  try {
    const user_id = req.user.userId; // 🔒 tokenista, ei frontendista

    const {
      entry_date,
      weight,
      sleep_hours,
      energy_level,
      stress_level,
      mood,
      symptom,
      medication,
      notes
    } = req.body;

const entry = {
  user_id,
  created_at: entry_date,
  weight,
  sleep: sleep_hours,
  energy: energy_level,
  stress: stress_level,
  mood,
  symptoms: symptom,
  medication,
  notes
};

    const result = await addEntry(entry);

    if (result.error) {
      return res.status(500).json({ error: result.error });
    }

    res.status(201).json({
      message: "entry created",
      id: result.entry_id
    });

  } catch (error) {
    console.error("postEntry", error);
    res.status(500).json({ error: "server error" });
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

const getEntriesByUser = async (req, res) => {
    // Haetaan merkintä URL-parametrin id:n perusteella
  const entry = await listEntriesByUserId(req.params.id);

  if (entry) {
    // Jos merkintä löytyy, palautetaan se JSONina
    res.json(entry);
  } else {
    // Jos ei löydy, palautetaan 404 Not Found
    res.sendStatus(404);
  }
};

export {getEntries, getEntryById, postEntry, putEntry, deleteEntry, getEntriesByUser};

// ChatGPT:tä hyödynnettiin:
// - Async controller -rakenteessa
// - Virheenkäsittelyn toteutuksessa
// - Pyyntöjen validoinnissa
// - Autentikoidun käyttäjän (req.user.user_id) yhdistämisessä tietokantaan