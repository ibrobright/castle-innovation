const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'castle.db');
let db;

function getDB() {
  if (!db) db = new sqlite3.Database(DB_PATH);
  return db;
}

function initDB() {
  return new Promise((resolve, reject) => {
    const db = getDB();
    db.run(`
      CREATE TABLE IF NOT EXISTS contact_messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        full_name TEXT NOT NULL,
        email TEXT NOT NULL,
        phone TEXT,
        service TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `, (err) => err ? reject(err) : resolve());
  });
}

function saveMessage(data) {
  return new Promise((resolve, reject) => {
    const db = getDB();
    const stmt = db.prepare(`INSERT INTO contact_messages (full_name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`);
    stmt.run([data.fullName, data.email, data.phone || null, data.service || null, data.message], function(err) {
      if (err) reject(err);
      else resolve(this.lastID);
    });
    stmt.finalize();
  });
}

module.exports = { initDB, saveMessage };