import express from 'express';
import {
  getEntries,
  getEntryById,
  postEntry,
  putEntry,
  deleteEntry
} from '../controllers/entry-controller.js';
import {authenticateToken} from '../middlewares/authentication.js';

// Luodaan uusi Express-router diary entry -reiteille
const entryRouter = express.Router();

/*
  GET    -> Hae kaikki päiväkirjamerkinnät
  POST   -> Lisää uusi merkintä (vaatii kirjautumisen / tokenin)
*/

entryRouter.route('/')
  .get(getEntries) // Palauttaa kaikki merkinnät tietokannasta
  .post(authenticateToken, postEntry); // Tarkistaa ensin JWT-tokenin, sitten lisää uuden merkinnän, käytetty ChatGPT:tä ymmärtämään

  /*
  Route: /api/entries/:id
  GET     -> Hae yksittäinen merkintä id:n perusteella
  PUT     -> Päivitä merkintä (vaatii kirjautumisen)
  DELETE  -> Poista merkintä (vaatii kirjautumisen)
*/

entryRouter.route('/:id')
  .get(getEntryById)
  .put(authenticateToken, putEntry)
  .delete(authenticateToken, deleteEntry);
  // Palauttaa yhden merkinnän id:n perusteella
  // Tarkistaa tokenin ja päivittää merkinnän
  // Tarkistaa tokenin ja poistaa merkinnän


export default entryRouter;