const { pool } = require("../config/database");
const bcrypt = require("bcrypt");

const createUserTable = async () => {
  const query = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    membership_status BOOLEAN DEFAULT FALSE,
    is_admin BOOLEAN DEFAULT FALSE);`;
  await pool.query(query);
};

const addUser = async (firstName, lastName, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `INSERT INTO users(first_name, last_name, username, password) VALUES ($1,$2,$3,$4) RETURNING *;`;
  const values = [firstName, lastName, username, hashedPassword];
  const result = await pool.query(query, values);
  return result.rows[0];
};

const findUserById = async (id) => {
  const query = `SELECT * FROM users WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

const findUserByUsername = async (username) => {
  const query = `SELECT * FROM users WHERE username = $1;`;
  const result = await pool.query(query, [username]);
  return result.rows[0];
};

const updateUserMembership = async (userId) => {
  const query = `
    UPDATE users
    SET membership_status = TRUE
    WHERE id = $1
    RETURNING *;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows[0];
};

module.exports = {
  createUserTable,
  addUser,
  findUserById,
  findUserByUsername,
  updateUserMembership,
};
