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

export { insertKubiosResults };