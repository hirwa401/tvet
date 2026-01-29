const express = require("express");
const db = require("./db.js");

// Import routes
const studentRoutes = require("./students.js");
const courseRoutes = require("./courses.js");
const enrollmentRoutes = require("./enrollments.js");

const app = express();
app.use(express.json());

const PORT = 3000;

// Use routes
app.use("/students", studentRoutes);
app.use("/courses", courseRoutes);
app.use("/enrollments", enrollmentRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

process.on('SIGINT', () => {
 db.end(err=> {
  if (err) return console.log(err);
  console.log("MySQL pool closed.");
  process.exit(0);
 });
})
