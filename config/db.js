require('dotenv').config(); // Load environment variables from .env file

const { Pool } = require('pg');

// Set up the connection pool using environment variables
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Test the connection using async/await
(async () => {
    try {
        await pool.connect();
        console.log("Connected to PostgreSQL database!");
    } catch (err) {
        console.error("Error connecting to PostgreSQL:", err);
    }
})();

module.exports = pool;
