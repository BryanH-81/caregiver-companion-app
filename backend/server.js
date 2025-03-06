require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pool = require('./src/config/db');  // ✅ Correct path

const app = express();
app.use(express.json());
app.use(cors());

// Import middleware & routes
const { verifyToken } = require('./src/middleware/auth');
const taskRoutes = require('./src/routes/tasks');

// Use task routes
app.use("/api/tasks", taskRoutes);

// Generate a JWT Token
function generateToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

// Protected Route (Example: Get user profile)
app.get('/api/auth/profile', verifyToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// Server listening
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

module.exports = { generateToken, verifyToken };
