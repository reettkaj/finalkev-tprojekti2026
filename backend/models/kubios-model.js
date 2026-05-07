import promisePool from '../utils/database.js';

const insertKubiosResults = async (userId, results) => {
  const sql = `
    INSERT INTO kubios_results (user_id, date, readiness, stress_index)
    VALUES (?, ?, ?, ?)
  `;

for (const entry of results) {

  // skip jos päivämäärä puuttuu
  if (!entry.daily_result) {
    console.log('SKIPPED (no date):', entry);
    continue;
  }

  const values = [
    userId,
    entry.daily_result,
    entry.result?.readiness ?? null,
    entry.result?.stress_index ?? null,
  ];

  // debug
  console.log('INSERTING:', values);

  const [result] = await promisePool.execute(sql, values);

  console.log('DB RESULT:', result);
}
};

const fetchKubiosDataForUser = async (userId) => {

  const sql = `
    SELECT *
    FROM kubios_results
    WHERE user_id = ?
    ORDER BY date DESC
  `;

  try {

    const [rows] =
      await promisePool.execute(sql, [userId]);

    return {
      results: rows
    };

  } catch (error) {

    console.error(error);

    return {
      error: error.message
    };
  }
};

export {
  insertKubiosResults,
  fetchKubiosDataForUser
};
