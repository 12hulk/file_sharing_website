require('dotenv').config(); // Load environment variables from .env file

const { Pool } = require('pg');

// Set up the connection pool using environment variables
const pool = new Pool({
    user: "postgres.ekdoxzpypavhtoklntqv",            // Database user
    host: "aws-0-ca-central-1.pooler.supabase.com",            // Database host (localhost or remote)
    database: "postgres",    // Database name
    password: "__prwwt1292",    // Database password
    port: "6543",            // Database port
});

// Test the connection
pool.connect()
    .then(() => {
        console.log("Connected to PostgreSQL database!");
    })
    .catch(err => {
        console.error("Error connecting to PostgreSQL:", err);
    });

module.exports = pool;
