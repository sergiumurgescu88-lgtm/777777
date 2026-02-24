import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const db = new Database(process.env.DATABASE_PATH || "database.sqlite");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    credits INTEGER DEFAULT 5,
    tokens INTEGER DEFAULT 0,
    is_premium BOOLEAN DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS characters (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    description TEXT,
    physical_traits TEXT, -- JSON
    is_active BOOLEAN DEFAULT 0,
    thumbnail TEXT
  );

  CREATE TABLE IF NOT EXISTS marketplace_models (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER,
    description TEXT,
    traits TEXT, -- JSON
    tier TEXT,
    licenses_claimed INTEGER DEFAULT 0,
    max_licenses INTEGER DEFAULT 5,
    thumbnail TEXT
  );

  CREATE TABLE IF NOT EXISTS media (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT, -- image, video
    url TEXT,
    character_id INTEGER,
    folder_id INTEGER,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    metadata TEXT -- JSON
  );

  CREATE TABLE IF NOT EXISTS folders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    color TEXT
  );

  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    positive TEXT,
    negative TEXT,
    category TEXT
  );
`);

  // Seed marketplace if empty
  const modelCount = db.prepare("SELECT COUNT(*) as count FROM marketplace_models").get() as { count: number };
  if (modelCount.count === 0) {
    const models = [
      { name: "Brielle Tate", age: 28, description: "Modern sophistication, brunette with hazel eyes. Perfect for luxury brands.", tier: "Classic", licenses: 4, thumbnail: "https://picsum.photos/seed/brielle/400/600" },
      { name: "Tiffany Brooks", age: 22, description: "Sleek elegance, blonde with blue eyes. Glamour and high-end events.", tier: "Classic", licenses: 4, thumbnail: "https://picsum.photos/seed/tiffany/400/600" },
      { name: "Charlotte Pemberton", age: 30, description: "Timeless beauty, old Hollywood glamour meets modern sophistication.", tier: "Classic", licenses: 3, thumbnail: "https://picsum.photos/seed/charlotte/400/600" },
      { name: "Lia Belle", age: 24, description: "Chic bikinis & evening wear. Sultry brunette with a playful edge.", tier: "Premium", licenses: 1, thumbnail: "https://picsum.photos/seed/lia/400/600" },
      { name: "Bree Zane", age: 21, description: "Platinum blonde, sporty chic and energetic vibes.", tier: "Classic", licenses: 0, thumbnail: "https://picsum.photos/seed/bree/400/600" },
      { name: "Avery Donovan", age: 29, description: "Entrepreneur, luxury brands, Wall Street intelligence.", tier: "Elite", licenses: 5, thumbnail: "https://picsum.photos/seed/avery/400/600" },
      { name: "Mia Sunset", age: 23, description: "Beach lover, fitness enthusiast, golden hour specialist.", tier: "Premium", licenses: 2, thumbnail: "https://picsum.photos/seed/mia/400/600" },
      { name: "Luna Dark", age: 25, description: "Alternative fashion, goth aesthetic, gaming and tech.", tier: "Elite", licenses: 1, thumbnail: "https://picsum.photos/seed/luna/400/600" },
    ];

    const insert = db.prepare("INSERT INTO marketplace_models (name, age, description, tier, licenses_claimed, thumbnail) VALUES (?, ?, ?, ?, ?, ?)");
    models.forEach(m => insert.run(m.name, m.age, m.description, m.tier, m.licenses, m.thumbnail));
  }

// Ensure user exists
const user = db.prepare("SELECT * FROM users LIMIT 1").get();
if (!user) {
  db.prepare("INSERT INTO users (credits, tokens) VALUES (5, 0)").run();
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '50mb' }));
  const PORT = 3000;

  // API Routes
  app.get("/api/user", (req, res) => {
    const user = db.prepare("SELECT * FROM users LIMIT 1").get();
    res.json(user);
  });

  app.post("/api/user/add-credits", (req, res) => {
    const { amount } = req.body;
    db.prepare("UPDATE users SET credits = credits + ?").run(amount);
    res.json({ success: true });
  });

  app.get("/api/characters", (req, res) => {
    const chars = db.prepare("SELECT * FROM characters").all();
    res.json(chars);
  });

  app.post("/api/characters", (req, res) => {
    const { name, age, description, thumbnail } = req.body;
    const result = db.prepare("INSERT INTO characters (name, age, description, thumbnail) VALUES (?, ?, ?, ?)").run(name, age, description, thumbnail);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/marketplace", (req, res) => {
    const models = db.prepare("SELECT * FROM marketplace_models").all();
    res.json(models);
  });

  app.post("/api/marketplace/claim", (req, res) => {
    const { modelId } = req.body;
    const model = db.prepare("SELECT * FROM marketplace_models WHERE id = ?").get() as any;
    const user = db.prepare("SELECT * FROM users LIMIT 1").get() as any;

    if (model.licenses_claimed >= model.max_licenses) {
      return res.status(400).json({ error: "All licenses claimed" });
    }
    if (user.tokens <= 0) {
      return res.status(400).json({ error: "Not enough tokens" });
    }

    db.prepare("UPDATE marketplace_models SET licenses_claimed = licenses_claimed + 1 WHERE id = ?").run(modelId);
    db.prepare("UPDATE users SET tokens = tokens - 1").run();
    
    // Add to characters
    db.prepare("INSERT INTO characters (name, age, description, thumbnail, is_active) VALUES (?, ?, ?, ?, 1)").run(model.name, model.age, model.description, model.thumbnail);

    res.json({ success: true });
  });

  app.get("/api/media", (req, res) => {
    const media = db.prepare("SELECT * FROM media ORDER BY created_at DESC").all();
    res.json(media);
  });

  app.post("/api/media", (req, res) => {
    const { type, url, character_id, folder_id, metadata } = req.body;
    const result = db.prepare("INSERT INTO media (type, url, character_id, folder_id, metadata) VALUES (?, ?, ?, ?, ?)").run(type, url, character_id, folder_id, JSON.stringify(metadata));
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/folders", (req, res) => {
    const folders = db.prepare("SELECT * FROM folders").all();
    res.json(folders);
  });

  app.post("/api/folders", (req, res) => {
    const { name, color } = req.body;
    const result = db.prepare("INSERT INTO folders (name, color) VALUES (?, ?)").run(name, color);
    res.json({ id: result.lastInsertRowid });
  });

  app.post("/api/user/deduct-credits", (req, res) => {
    const { amount } = req.body;
    const user = db.prepare("SELECT credits FROM users LIMIT 1").get() as any;
    if (user.credits < amount) {
      return res.status(400).json({ error: "Insufficient credits" });
    }
    db.prepare("UPDATE users SET credits = credits - ?").run(amount);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
