const express = require("express");
const router = express.Router();
const db = require("./db.js");

// POST /enrollments -> Enroll student in a course
router.post("/", async (req, res) => {
  const { student_id, course_id } = req.body;
  if (!student_id || !course_id) {
    return res.status(400).json({ error: "Missing student_id or course_id" });
  }
  try {
    // Note: The FOREIGN KEY constraints in MySQL will automatically prevent
    // enrolling a non-existent student or course.
    const sql = `INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)`;
    const [result] = await db.query(sql, [student_id, course_id]);
    res.status(201).json({ id: result.insertId, message: "Student enrolled successfully" });
  } catch (err) {
    if (err.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ error: "Enrollment conflict. The student may already be enrolled in this course." });
    }
    if (err.code === "ER_NO_REFERENCED_ROW_2") {
      return res.status(404).json({ error: "Student or Course not found." });
    }
    res.status(500).json({ error: err.message });
  }
});

// GET /enrollments -> View enrollments
router.get("/", async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.enrollment_id,
        s.student_id,
        s.first_name,
        s.last_name,
        c.course_id,
        c.course_name,
        e.enrollment_date
      FROM enrollments e
      JOIN students s ON e.student_id = s.student_id
      JOIN courses c ON e.course_id = c.course_id
    `;
    const [rows] = await db.query(sql);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /enrollments/:id -> Delete an enrollment
router.delete("/:id", async (req, res) => {
  try {
    const sql = `DELETE FROM enrollments WHERE enrollment_id = ?`;
    const [result] = await db.query(sql, [req.params.id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Enrollment not found" });
    }
    res.json({ message: "Enrollment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;