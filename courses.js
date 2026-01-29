const express = require("express");
const router = express.Router();
const db = require("./db.js");

// POST /courses -> Add a course
router.post("/", async (req, res) => {
  const { course_name, course_code, duration } = req.body;
  if (!course_name || !course_code || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const sql = `INSERT INTO courses (course_name, course_code, duration) VALUES (?, ?, ?)`;
    const [result] = await db.query(sql, [course_name, course_code, duration]);
    res.status(201).json({ id: result.insertId, message: "Course added successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Course code already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /courses -> List courses
router.get("/", async (req, res) => {
  try {
    const sql = "SELECT * FROM courses";
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT /courses/:id -> Update a course
router.put("/:id", async (req, res) => {
  const { course_name, course_code, duration } = req.body;
  if (!course_name || !course_code || !duration) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const sql = `UPDATE courses SET course_name = ?, course_code = ?, duration = ? WHERE course_id = ?`;
    const [result] = await db.query(sql, [course_name, course_code, duration, req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course updated successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Course code already exists." });
    }
    res.status(500).json({ error: err.message });
  }
});

// DELETE /courses/:id -> Delete a course
router.delete("/:id", async (req, res) => {
  try {
    const sql = `DELETE FROM courses WHERE course_id = ?`;
    const [result] = await db.query(sql, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Course not found" });
    }
    res.json({ message: "Course deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;