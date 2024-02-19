const express = require('express');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 3000;

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

app.use(express.json());

// Endpoint to save user details and results
app.post('/api/users', async (req, res) => {
  try {
    const { username, totalRating } = req.body;
    const client = await pool.connect();
    const result = await client.query('INSERT INTO users (username, total_rating) VALUES ($1, $2) RETURNING *', [username, totalRating]);
    const savedUser = result.rows[0];
    client.release();
    res.json(savedUser);
  } catch (err) {
    console.error('Error executing query', err);
    res.status(500).send('Internal Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
