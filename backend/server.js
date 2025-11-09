const express = require("express");
const cors = require("cors");
const oracledb = require("oracledb");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// Use environment variables if set (recommended)
const dbConfig = {
  user: process.env.DB_USER || "system",
  password: process.env.DB_PASSWORD || "sqldbms", // <-- CHANGE if needed
  connectString: process.env.DB_CONNECT_STRING || "localhost:1521/XE"
};

// Optional: adjust pool/autoCommit behavior
oracledb.autoCommit = true;

// Serve frontend (assumes frontend files are one level up in 'frontend' folder)
app.use(express.static(path.join(__dirname, "../frontend")));

// GET all products
app.get("/api/products", async (req, res) => {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    const result = await conn.execute(`SELECT id, name, category, price, stock FROM products`);
    // result.rows is an array of arrays; map to objects using metaData
    const rows = result.rows.map(r => ({
      id: r[0],
      name: r[1],
      category: r[2],
      price: r[3],
      stock: r[4]
    }));
    res.json(rows);
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) try { await conn.close(); } catch(_) {}
  }
});

// POST new product
app.post("/api/products", async (req, res) => {
  let conn;
  try {
    const { name, category, price, stock } = req.body;
    conn = await oracledb.getConnection(dbConfig);
    // Use RETURNING to get the generated id (if id is sequence-based)
    const result = await conn.execute(
      `INSERT INTO products (name, category, price, stock)
       VALUES (:name, :category, :price, :stock)
       RETURNING id INTO :id`,
      {
        name,
        category,
        price,
        stock,
        id: { dir: oracledb.BIND_OUT, type: oracledb.NUMBER }
      },
      { autoCommit: true }
    );
    const insertedId = (result.outBinds && result.outBinds.id && result.outBinds.id[0]) || null;
    res.status(201).json({ id: insertedId, name, category, price, stock });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) try { await conn.close(); } catch(_) {}
  }
});

// DELETE product
app.delete("/api/products/:id", async (req, res) => {
  let conn;
  try {
    const id = req.params.id;
    conn = await oracledb.getConnection(dbConfig);
    await conn.execute(`DELETE FROM products WHERE id = :id`, { id }, { autoCommit: true });
    res.json({ message: "Product deleted" });
  } catch (err) {
    console.error("DB ERROR:", err);
    res.status(500).json({ message: err.message });
  } finally {
    if (conn) try { await conn.close(); } catch(_) {}
  }
});

// Fallback to frontend index.html for SPA routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

// Start server (Render-compatible)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Oracle backend + frontend running at http://localhost:${PORT}`));
