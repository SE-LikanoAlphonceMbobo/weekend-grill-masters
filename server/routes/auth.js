const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');

const router = express.Router();

// Helper: Generate 6-digit code
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// 1. REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email',
      [name, email, hashedPassword]
    );
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error or Email already exists' });
  }
});

// 2. LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = userResult.rows[0];
    const validPass = await bcrypt.compare(password, user.password_hash);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 3. FORGOT PASSWORD (Step 1: Generate Code)
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Security: Don't reveal if email exists, but return success anyway
      return res.json({ message: 'If email exists, a recovery code has been sent.' });
    }

    const code = generateCode();
    const expiry = new Date(new Date().getTime() + 15 * 60000); // 15 mins

    await pool.query(
      'UPDATE users SET reset_code = $1, reset_code_expiry = $2 WHERE email = $3',
      [code, expiry, email]
    );

    // SIMULATION: Log to console instead of sending real email
    console.log(`\n📧 [EMAIL SIMULATION] Recovery code for ${email}: ${code}\n`);

    res.json({ message: 'Recovery code sent to console (simulated email)' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. RESET PASSWORD (Step 2: Verify Code & Update)
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND reset_code = $2',
      [email, code]
    );

    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid code' });

    const user = userResult.rows[0];
    if (new Date() > new Date(user.reset_code_expiry)) {
      return res.status(400).json({ error: 'Code has expired' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await pool.query(
      'UPDATE users SET password_hash = $1, reset_code = NULL, reset_code_expiry = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;