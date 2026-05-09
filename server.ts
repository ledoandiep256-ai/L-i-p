import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs/promises";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_FILE = path.join(__dirname, "db.json");

interface DBStructure {
  users: any[];
  branches: any[];
  members: any[];
}

const INITIAL_DB: DBStructure = {
  users: [],
  branches: [],
  members: []
};

async function getDB(): Promise<DBStructure> {
  try {
    const data = await fs.readFile(DB_FILE, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    await fs.writeFile(DB_FILE, JSON.stringify(INITIAL_DB, null, 2));
    return INITIAL_DB;
  }
}

async function saveDB(db: DBStructure) {
  await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2));
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.post("/api/login", async (req, res) => {
    const { username, password } = req.body;
    const db = await getDB();
    const user = db.users.find(u => 
      (u.email === username || u.phone === username) && u.password === password
    );

    if (user) {
      const { password, ...userWithoutPassword } = user;
      res.json({ success: true, user: userWithoutPassword });
    } else {
      res.status(401).json({ success: false, message: "Sai tài khoản hoặc mật khẩu" });
    }
  });

  app.post("/api/register", async (req, res) => {
    const newUser = req.body;
    const db = await getDB();
    
    const exists = db.users.find(u => 
      (newUser.email && u.email === newUser.email) || 
      (newUser.phone && u.phone === newUser.phone) ||
      (newUser.unitName && u.unitName.toLowerCase() === newUser.unitName.toLowerCase())
    );

    if (exists) {
      return res.status(400).json({ success: false, message: "Tài khoản đã tồn tại" });
    }

    db.users.push(newUser);
    await saveDB(db);
    res.json({ success: true });
  });

  app.post("/api/reset-password", async (req, res) => {
    const { contact, newPassword } = req.body;
    const db = await getDB();
    const userIndex = db.users.findIndex(u => u.email === contact || u.phone === contact);
    
    if (userIndex !== -1) {
      db.users[userIndex].password = newPassword;
      await saveDB(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ success: false, message: "Không tìm thấy thông tin" });
    }
  });

  app.get("/api/data", async (req, res) => {
    const { unitId } = req.query;
    const db = await getDB();
    
    // For simplicity, we return everything requested, 
    // but in a real app we'd filter strictly by unitId if provided.
    // For this migration, we'll return the whole DB if no unitId, 
    // or filter if it is provided.
    if (!unitId) {
      return res.json(db);
    }

    const filteredData = {
      users: db.users, // Users list is usually needed for login/checks
      branches: db.branches.filter(b => b.unitId === unitId),
      members: db.members.filter(m => m.unitId === unitId)
    };
    res.json(filteredData);
  });

  app.post("/api/sync", async (req, res) => {
    const { branches, members, users, unitId } = req.body;
    const db = await getDB();
    
    // Update or Merge logic
    if (branches && unitId) {
      // Remove old branches for this unit and add new ones
      db.branches = [
        ...db.branches.filter(b => b.unitId !== unitId),
        ...branches
      ];
    }
    
    if (members && unitId) {
      // Remove old members for this unit and add new ones
      db.members = [
        ...db.members.filter(m => m.unitId !== unitId),
        ...members
      ];
    }
    
    if (users) {
      // For users we merge by ID to avoid duplicates
      users.forEach((u: any) => {
        const index = db.users.findIndex(existing => existing.id === u.id);
        if (index !== -1) {
          db.users[index] = { ...db.users[index], ...u };
        } else {
          db.users.push(u);
        }
      });
    }

    await saveDB(db);
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
