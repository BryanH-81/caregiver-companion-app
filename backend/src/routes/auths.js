const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool } = require("../config/db");  // Import pool from db.js

router.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input before proceeding
    if (!name || !email || !password) {
        return res.status(400).json({ error: "All fields (name, email, password) are required" });
    }

    try {
        // Hash the password with bcrypt
        const hashedPassword = await bcrypt.hash(password, 10);

        // Check if the email already exists in the database
        const emailCheckResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (emailCheckResult.rows.length > 0) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Insert the new user into the database using the correct column name 'password_hash'
        const result = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        const user = result.rows[0];

        // Create a JWT token for the new user
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,  // Use your JWT secret key from environment variables
            { expiresIn: "1h" }     // Set expiration for the token
        );

        // Respond with the new user and their token
        res.status(201).json({ user, token });
    } catch (err) {
        console.error("Registration Error:", err);
        res.status(500).json({ error: "Registration failed", details: err.message });
    }
});

module.exports = router;


