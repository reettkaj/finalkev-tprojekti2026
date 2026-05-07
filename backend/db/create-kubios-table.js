import promisePool from '../utils/database.js'; 

const createTable = async () => {
  try {
    const sql = `
      CREATE TABLE IF NOT EXISTS kubios_results (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT,
        date DATETIME,
        readiness FLOAT,
        stress_index FLOAT
      );
    `;

    await promisePool.execute(sql);

    console.log('kubios_results table created!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit();
  }
};

createTable();