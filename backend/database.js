const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./ecommerce.db');

// Create Users table
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      address TEXT,
      contact_no TEXT
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS wishlist (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      items TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )  
  `)
  db.run(`
    CREATE TABLE IF NOT EXISTS userCart (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      items TEXT,
      FOREIGN KEY (user_id) REFERENCES users (id)
    )  
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS payments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_id TEXT NOT NULL UNIQUE,
      payment_id TEXT NOT NULL UNIQUE,
      user_id TEXT,         
      order_for TEXT,
      amount REAL,   
      delivered_at TEXT,
      products TEXT NOT NULL,             
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS product_reviews (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      prod_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      username VARCHAR(255),
      title VARCHAR(255),
      review TEXT,
      rating INT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users (id)
    );
  `);
  db.run(`
    CREATE TABLE IF NOT EXISTS used_tokens (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      token TEXT NOT NULL,
      email TEXT NOT NULL,
      FOREIGN KEY (email) REFERENCES users (email)
    );
  `);
});

module.exports = db;
