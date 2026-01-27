const express = require('express');
const pool = require('../db');
const adminMiddleware = require('../middleware/admin'); // Protect admin actions

const router = express.Router();

// Public: Get all items
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Public: Get Single Item by ID (NEW)
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM inventory WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Add new item
router.post('/', adminMiddleware, async (req, res) => {
  const { name, description, price, image_url, category } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO inventory (name, description, price, image_url, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, image_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Admin: Delete item
router.delete('/:id', adminMiddleware, async (req, res) => {
  try {
    await pool.query('DELETE FROM inventory WHERE id = $1', [req.params.id]);
    res.json({ message: 'Item deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;