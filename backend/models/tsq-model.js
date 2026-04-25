import promisePool from '../utils/database.js';

// GET /api/tsq
const findTsqByUserId = async (id) => {
  const sql = `
    SELECT points, created_at
    FROM TraumaScreeningQuestionnaire
    WHERE user_id = ?
    ORDER BY created_at DESC
  `;
  const [rows] = await promisePool.execute(sql, [id]);
  return rows;
};

// POST /api/tsq
const addTsq = async (tsq) => {
  const { user_id, points, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10  } = tsq;

  const sql = `
    INSERT INTO TraumaScreeningQuestionnaire (user_id, points, q1, q2, q3, q4, q5, q6, q7, q8, q9, q10)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const [result] = await promisePool.execute(sql, [
    user_id,
    points,
    q1,
    q2,
    q3,
    q4,
    q5,
    q6,
    q7,
    q8,
    q9,
    q10,
  ]);

  return { id: result.insertId };
};

// GET /api/tsq/:id
const findTsqById = async (id) => {
    const sql = `
        SELECT *
        FROM TraumaScreeningQuestionnaire
        WHERE id = ?
    `;
    const [rows] = await promisePool.execute(sql, [id]);
    return rows[0];
};

export{findTsqByUserId,addTsq,findTsqById};