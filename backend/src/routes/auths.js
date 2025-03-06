const { verifyToken } = require('../middleware/auth'); // Import middleware

// Protected Route (Example: Get user profile)
router.get('/profile', verifyToken, async (req, res) => {
    try {
        const user = await pool.query("SELECT id, name, email FROM users WHERE id = $1", [req.user.id]);
        if (user.rows.length === 0) return res.status(404).json({ error: "User not found" });

        res.json(user.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});
