const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

// 🗄️ Database setup
const dbPath = path.join(__dirname, 'inventory.db');
const dbExists = fs.existsSync(dbPath);
const db = new sqlite3.Database(dbPath);

if (!dbExists) {
  db.run(`
    CREATE TABLE products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      category TEXT,
      price REAL NOT NULL,
      stock INTEGER NOT NULL
    )
  `);
  console.log("✅ New SQLite database created: inventory.db");
}

// 🌍 Serve frontend files
app.use(express.static(path.join(__dirname, '../frontend')));

// GET all products
app.get('/api/products', (req, res) => {
  db.all('SELECT * FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// ADD new product
app.post('/api/products', (req, res) => {
  const { name, category, price, stock } = req.body;
  const query = `INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)`;
  db.run(query, [name, category, price, stock], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, category, price, stock });
  });
});

// DELETE product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  db.run('DELETE FROM products WHERE id = ?', id, function (err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Deleted successfully' });
  });
});

// Fallback route
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start server
const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
