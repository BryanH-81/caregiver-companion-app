const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const { verifyToken } = require("../middleware/auth");

// ✅ Get all tasks for the logged-in caregiver
router.get("/", verifyToken, async (req, res) => {
    try {
        const tasks = await pool.query("SELECT * FROM tasks WHERE caregiver_id = $1", [req.user.id]);
        res.json(tasks.rows);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

// ✅ Create a new task
router.post("/", verifyToken, async (req, res) => {
    const { title, description, due_date } = req.body;
    try {
        const newTask = await pool.query(
            "INSERT INTO tasks (caregiver_id, title, description, due_date) VALUES ($1, $2, $3, $4) RETURNING *",
            [req.user.id, title, description, due_date]
        );
        res.status(201).json(newTask.rows[0]);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
