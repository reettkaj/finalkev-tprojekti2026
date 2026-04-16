import promisePool from '../utils/database.js';

// GET /api/users
const getAllUsers = async () => {
  const sql = `
    SELECT user_id, email, name, created_at
    FROM Users
  `;
  const [rows] = await promisePool.execute(sql);
  return rows;
};

// GET /api/users/:id
const findUserById = async (id) => {
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
  const { email, password, name, auth_provider, role_id } = user;

  const sql = `
    INSERT INTO Users (email, password, name, auth_provider, role_id)
    VALUES (?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    email,
    password,
    name,
    auth_provider,
    role_id,
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
const findUserByEmail = async (email) => {
  try {
    const sql = 'SELECT * FROM Users WHERE email=?';
    const params = [email];
    const [rows] = await promisePool.query(sql, params);
    // console.log(rows);
    // if nothing is found with the user id, result array is empty []
    if (rows.length === 0) {
      return {error: 404, message: 'user not found'};
    }
    // Remove password property from result
    //delete rows[0].password;
    return rows[0];
  } catch (error) {
    console.error('selectUserByEmail', error);
    return {error: 500, message: 'db error'};
  }
};

const findPatients = async (id) => {
  try {
    const sql = 'SELECT user_id, email, name FROM Users WHERE doctor_id=?';
    const params = [id];
    const [rows] = await promisePool.query(sql, params);
    if (rows.length === 0) {
      return {error: 404, message: 'patients not found'};
    }
    return rows;
  } catch (error) {
    console.error('findPatients', error);
    return {error: 500, message: 'db error'};
  }
};

export {
  getAllUsers,
  findUserById,
  addUser,
  updateUser,
  deleteUser,
  findUserByEmail,
  findPatients
};

// ChatGPT:tä on hyödynnetty  yleisesti user-modelissa:
// - Async-tietokantafunktioiden rakenteessa
// - Parametrisoitujen SQL-kyselyiden (prepared statements) kirjoittamisessa
// - Tulosten palautusrakenteen suunnittelussa