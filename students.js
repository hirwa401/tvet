const express = require("express");
const router = express.Router();
const db = require("./db.js");

// POST /students -> Register a student
router.post("/", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email) { // phone can be optional
    return res.status(400).json({ error: "Missing required fields: first_name, last_name, email" });
  }
  try {
    const sql = `INSERT INTO students (first_name, last_name, email, phone) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [first_name, last_name, email, phone]);
    res.status(201).json({ id: result.insertId, message: "Student registered successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /students -> List students
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM students";
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /students/:id -> Get a single student
router.get("/:id", async (req, res) => {
  try {
    const sql = "SELECT * FROM students WHERE student_id = ?";
    const [rows] = await db.query(sql, [req.params.id]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /students/:id -> Update a student
router.put("/:id", async (req, res) => {
  const { first_name, last_name, email, phone } = req.body;
  if (!first_name || !last_name || !email) {
    return res.status(400).json({ error: "Missing required fields: first_name, last_name, email" });
  }
  try {
    const sql = `UPDATE students SET first_name = ?, last_name = ?, email = ?, phone = ? WHERE student_id = ?`;
    const [result] = await db.query(sql, [first_name, last_name, email, phone, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student updated successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Email already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /students/:id -> Delete a student
router.delete("/:id", async (req, res) => {
  try {
    const sql = `DELETE FROM students WHERE student_id = ?`;
    const [result] = await db.query(sql, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;