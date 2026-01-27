const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db');
const nodemailer = require('nodemailer');

const router = express.Router();
const generateCode = () => Math.floor(100000 + Math.random() * 900000).toString();

// Helper: Send Email
const sendEmail = async (email, code) => {
  try {
    const testAccount = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: { user: testAccount.user, pass: testAccount.pass },
    });

    await transporter.sendMail({
      from: '"Weekend Grill Masters" <noreply@grillmasters.com>',
      to: email,
      subject: "Password Reset Code",
      text: `Your recovery code is: ${code}`,
      html: `<b>Your recovery code is: ${code}</b>`,
    });
  } catch (err) {
    console.error("Email Error:", err);
  }
};

// 1. REGISTER (Updated to save Question/Answer)
router.post('/register', async (req, res) => {
  const { name, email, password, security_question, security_answer } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    // Hash the answer too!
    const hashedAnswer = await bcrypt.hash(security_answer, 10);
    
    const result = await pool.query(
      'INSERT INTO users (name, email, password_hash, security_question, security_answer) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email',
      [name, email, hashedPassword, security_question, hashedAnswer]
    );
    res.status(201).json({ message: 'User created', user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// 2. LOGIN (No changes)
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

// 3. FORGOT PASSWORD - STEP 1 (Get Question)
router.post('/forgot-password/step1', async (req, res) => {
  const { email } = req.body;
  try {
    const userResult = await pool.query('SELECT security_question FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      // Don't reveal if email exists
      return res.json({ step: 2, message: 'If email exists, step 2 ready' });
    }
    res.json({ step: 2, security_question: userResult.rows[0].security_question });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 4. FORGOT PASSWORD - STEP 2 (Verify Answer -> Return Code)
router.post('/forgot-password/step2', async (req, res) => {
  const { email, security_answer } = req.body;
  try {
    const userResult = await pool.query('SELECT id, security_answer FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.status(400).json({ error: 'Invalid input' });

    const user = userResult.rows[0];

    // Verify Answer
    const validAnswer = await bcrypt.compare(security_answer, user.security_answer);
    if (!validAnswer) return res.status(400).json({ error: 'Incorrect answer to security question' });

    // Answer is correct! Generate Code
    const code = generateCode();
    const expiry = new Date(new Date().getTime() + 15 * 60000);

    await pool.query(
      'UPDATE users SET reset_code = $1, reset_code_expiry = $2 WHERE email = $3',
      [code, expiry, email]
    );

    // CHANGE HERE: We return the code directly instead of sending email
    res.json({ step: 3, code: code, message: 'Security Verified. Here is your code.' });
    
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// 5. RESET PASSWORD (No changes)
router.post('/reset-password', async (req, res) => {
  const { email, code, newPassword } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND reset_code = $2', [email, code]);
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