const oracledb = require("oracledb");

const dbConfig = {
  user: "system",            // your Oracle username
  password: "sqldbms", // <-- change this
  connectString: "localhost:1521/XE" // or your Oracle service name
};

async function test() {
  let conn;
  try {
    conn = await oracledb.getConnection(dbConfig);
    console.log("✅ Connected successfully to Oracle Database!");
    const result = await conn.execute("SELECT 'Oracle connection works!' AS msg FROM dual");
    console.log(result.rows[0][0]);
  } catch (err) {
    console.error("❌ Connection failed:", err);
  } finally {
    if (conn) await conn.close();
  }
}

test();
