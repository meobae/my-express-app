require("dotenv").config();
const express = require("express");
const { Pool } = require("pg");

const app = express();
const port = process.env.PORT || 3000;

// Kết nối tới database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } // Render yêu cầu SSL
});

// Middleware để đọc JSON
app.use(express.json());

// Route gốc
app.get("/", (req, res) => {
  res.send("API đang chạy!");
});

// Route để test kết nối database
app.get("/dbtest", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({ serverTime: result.rows[0].now });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Route để lấy dữ liệu (ví dụ: lấy tất cả người dùng)
app.get("/users", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM users"); // bảng 'users' (thay theo db của bạn)
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

// Route để thêm dữ liệu (ví dụ: thêm người dùng)
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (name, email) VALUES ($1, $2) RETURNING *",
      [name, email]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

app.listen(port, () => {
  console.log(`Server đang chạy trên port ${port}`);
});
