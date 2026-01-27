const authMiddleware = require('./auth');

const adminMiddleware = async (req, res, next) => {
  // First ensure they are logged in
  authMiddleware(req, res, () => {
    // Then check their role from the database
    const pool = require('../db');
    
    pool.query('SELECT role FROM users WHERE id = $1', [req.userId])
      .then(result => {
        if (result.rows[0].role === 'admin') {
          next(); // They are admin, proceed
        } else {
          res.status(403).json({ error: 'Access denied. Admins only.' });
        }
      })
      .catch(() => res.status(500).json({ error: 'Error verifying role' }));
  });
};

module.exports = adminMiddleware;