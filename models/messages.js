const { pool } = require("../config/database");

const createMessageTable = async () => {
  const query = `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
        title VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        timestamp TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
        user_id INTEGER REFERENCES users(id)
    );
`;
  await pool.query(query);
};

const addMessage = async (title, text, userId) => {
  const query = `
  INSERT INTO messages (title, text, user_id) 
  VALUES ($1,$2,$3)
  RETURNING *;
  `;
  const values = [title, text, userId];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getAllMessages = async () => {
  const query = `SELECT * FROM messages`;
  const result = await pool.query(query);
  return result.rows;
};

module.exports = { createMessageTable, addMessage, getAllMessages };
