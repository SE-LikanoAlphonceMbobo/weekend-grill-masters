const express = require('express');
const pool = require('../db');
const authMiddleware = require('../middleware/auth'); // Import the middleware

const router = express.Router();

// 1. CREATE A BOOKING (POST)
router.post('/', authMiddleware, async (req, res) => {
  // We get userId from the middleware, not the body (for security)
  const { event_date, location, total_price } = req.body; 
  const user_id = req.userId; 

  try {
    const result = await pool.query(
      'INSERT INTO bookings (user_id, event_date, location, total_price, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [user_id, event_date, location, total_price, 'Confirmed']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. GET USER BOOKINGS (GET)
router.get('/', authMiddleware, async (req, res) => {
  const user_id = req.userId;

  try {
    const result = await pool.query(
      'SELECT * FROM bookings WHERE user_id = $1 ORDER BY created_at DESC',
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;