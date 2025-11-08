const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// ================================
// 📦 DATABASE SETUP (SQLite)
// ================================
const dbPath = path.join(__dirname, "inventory.db");
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Error opening database:", err);
  } else {
    console.log("✅ Connected to SQLite database");
    db.run(
      `CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT,
        price REAL NOT NULL,
        stock INTEGER NOT NULL
      )`,
      (err) => {
        if (err) console.error("❌ Error creating table:", err);
      }
    );
  }
});

// ================================
// 🌐 ROUTES (API ENDPOINTS)
// ================================

// Get all products (READ)
app.get("/api/products", (req, res) => {
  db.all("SELECT * FROM products", [], (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json(rows);
  });
});

// Add a new product (CREATE)
app.post("/api/products", (req, res) => {
  const { name, category, price, stock } = req.body;
  const query =
    "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)";
  db.run(query, [name, category, price, stock], function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.status(201).json({ id: this.lastID, name, category, price, stock });
  });
});

// Delete a product (DELETE)
app.delete("/api/products/:id", (req, res) => {
  const { id } = req.params;
  db.run("DELETE FROM products WHERE id = ?", id, function (err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database error" });
    }
    res.json({ message: "Product deleted" });
  });
});

// ================================
// ⚙️ SERVE FRONTEND FILES
// ================================
app.use(express.static(path.join(__dirname, "../frontend")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// ================================
// 🚀 START SERVER (Render Compatible)
// ================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
