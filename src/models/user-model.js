import promisePool from '../utils/database.js';

// GET /api/users
const getAllUsers = async () => {
  const sql = `
    SELECT user_id, username, email, created_at, user_level
    FROM Users
  `;
  const [rows] = await promisePool.execute(sql);
  return rows;
};

// GET /api/users/:id
const getUserById = async (id) => {
  const sql = `
    SELECT user_id, username, email, created_at, user_level
    FROM Users
    WHERE user_id = ?
  `;
  const [rows] = await promisePool.execute(sql, [id]);
  return rows[0];
};

// POST /api/users
const addUser = async (user) => {
  const { username, password, email } = user;

  const sql = `
    INSERT INTO Users (username, password, email)
    VALUES (?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    username,
    password,
    email,
  ]);

  return { user_id: result.insertId };
};

// PUT /api/users/:id (optional)
const updateUser = async (id, user) => {
  const { username, password, email, user_level } = user;

  const sql = `
    UPDATE Users
    SET username = ?, password = ?, email = ?, user_level = ?
    WHERE user_id = ?
  `;

  const [result] = await promisePool.execute(sql, [
    username,
    password,
    email,
    user_level,
    id,
  ]);

  return result.affectedRows;
};

// DELETE /api/users/:id (optional)
const deleteUser = async (id) => {
  const sql = `DELETE FROM Users WHERE user_id = ?`;
  const [result] = await promisePool.execute(sql, [id]);
  return result.affectedRows;
};

// LOGIN helper
const findUserByUsername = async (username) => {
  const sql = 'SELECT * FROM Users WHERE username = ?';
  const [rows] = await promisePool.execute(sql, [username]);
  return rows[0];
};

const findUserById = async (id) => {
  const [rows] = await promisePool.query(
    'SELECT user_id, username, email FROM Users WHERE user_id = ?',
    [id]
  );
  return rows[0];
};

const listAllUsers = async () => {
  const [rows] = await promisePool.query('SELECT * FROM Users');
  return rows;
};

export {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
  deleteUser,
  findUserById,
  findUserByUsername,
  listAllUsers
};

// ChatGPT:tä on hyödynnetty  yleisesti user-modelissa:
// - Async-tietokantafunktioiden rakenteessa
// - Parametrisoitujen SQL-kyselyiden (prepared statements) kirjoittamisessa
// - Tulosten palautusrakenteen suunnittelussa