// HUOM: mokkidata on poistettu modelista
//import users from '../models/user-model.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import {
  findUserByEmail,
  getAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser,
  findPatients,
  noLongerNewUser
} from '../models/user-model.js';

// TODO: lisää tietokantafunktiot user modeliin
// ja käytä niitä täällä

// TODO: refaktoroi tietokantafunktiolle
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
  // ÄLÄ IKINÄ lähetä salasanoja HTTP-vastauksessa
    // kaikki emailit sensuroitu esimerkki
    // users[i].email = 'sensored';


// TODO: getUserById
const getUserById = async (req, res) => {
  try {
    const user = await findUserById(req.params.id);
    if (!user) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};
// TODO: putUserById
const putUserById = async (req, res) => {
  try {
    const result = await updateUser(req.params.id, req.body);
    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json({message: 'user updated'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// TODO: deleteUserById
const deleteUserById = async (req, res) => {
  try {
    const result = await deleteUser(req.params.id);
    if (result.affectedRows === 0) {
      return res.status(404).json({error: 'user not found'});
    }
    res.json({message: 'user deleted'});
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

// Käyttäjän lisäys (rekisteröityminen)
// TODO: refaktoroi tietokantafunktiolle

const postUser = async (pyynto, vastaus) => {
  const newUser = pyynto.body;

  // HUOM: ÄLÄ ikinä loggaa käyttäjätietoja ensimmäisten pakollisten testien jälkeen!!! (tietosuoja)
  //console.log('registering new user', newUser);

  // Lasketaan salasanasta tiiviste (hash)
  const hash = await bcrypt.hash(newUser.password, 10);
  //console.log('salasanatiiviste:', hash);
  // Korvataan selväkielinen salasana tiivisteellä ennen kantaan tallennusta
  newUser.password = hash;
  try {
    const newUserId = await addUser(newUser);
    vastaus.status(201).json({message: 'new user added', user_id: newUserId});
  } catch (error) {
    // uuden virheen heittäminen käsitellään oletus error handlerilla
    // vaihtoehto next(error) käyttöön
    throw new Error(error.message);
  }
};

// Tietokantaversio valmis
const postLogin = async (req, res) => {
  const {email, password} = req.body;
  // haetaan käyttäjä-objekti käyttäjän nimen perusteella
  const user = await findUserByEmail(email);
  //console.log('postLogin user from db', user);
  if (user) {
    // jos asiakkaalta tullut salasana vastaa tietokannasta haettua tiivistettä, ehto on tosi
    if (await bcrypt.compare(password, user.password)) {
      delete user.password;
      // generate & sign token using a secret and expiration time
      // read from .env file
      const token = jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
      return res.json({message: 'login ok', user, token});
    }
    return res.status(403).json({error: 'invalid password'});
  }
  res.status(404).json({error: 'user not found'});
};

// Get user information stored inside token
const getMe = (req, res) => {
  res.json(req.user);
};

const getPatients = async (req, res) => {
  try {
    const users = await findPatients(req.params.id);
    if (!users) {
      return res.status(404).json({error: 'patients not found'});
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
};

const updateIsNew = async (req, res) => {
  try {
    const result = await noLongerNewUser(req.params.id);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'user not found' });
    }

    res.json({ message: 'user updated' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'server error' });
  }
};

export {
  getUsers,
  getUserById,
  putUserById,
  deleteUserById,
  postUser,
  postLogin,
  getMe,
  getPatients,
  updateIsNew
};
// ChatGPT:tä hyödynnettiin:
// - Async/await-rakenteen toteutuksessa
// - MVC-rakenteen selkeyttämisessä
// - REST-rajapinnan statuskoodien (200, 201, 400, 404, 500) käytössä
// - Controllerin ja modelin yhdistämisessä
