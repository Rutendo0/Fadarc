// server/index.ts
import express3 from "express";

// server/routes.ts
import { createServer } from "http";

// server/storage.ts
var MemStorage = class {
  users;
  quotes;
  products;
  currentUserId;
  currentQuoteId;
  currentProductId;
  constructor() {
    this.users = /* @__PURE__ */ new Map();
    this.quotes = /* @__PURE__ */ new Map();
    this.products = /* @__PURE__ */ new Map();
    this.currentUserId = 1;
    this.currentQuoteId = 1;
    this.currentProductId = 1;
    this.initializeProducts();
  }
  initializeProducts() {
    const sampleProducts = [
      {
        name: "Toyota Aqua Hybrid Battery",
        description: "Genuine OEM hybrid battery for Toyota Aqua 2011-2020. Low mileage, tested and certified with 1 year warranty.",
        category: "hybrid-batteries",
        imageUrl: "/attached_assets/image6.jpg"
      },
      {
        name: "Honda Vezel Gearbox",
        description: "Complete gearbox assembly for Honda Vezel hybrid models. Professional installation and fitting service available.",
        category: "transmissions",
        imageUrl: "/attached_assets/image7.png"
      },
      {
        name: "Toyota Prius Inverter Water Pump",
        description: "High-efficiency inverter water pump for Toyota Prius hybrid cooling system. Essential for optimal performance.",
        category: "cooling-systems",
        imageUrl: "/attached_assets/image3.jpg"
      },
      {
        name: "Toyota Aqua Brake Booster Assembly",
        description: "Complete ABS brake booster assembly for Toyota Aqua hybrid. Includes motor pump and professional fitting.",
        category: "brake-systems",
        imageUrl: "/attached_assets/image2.jpg"
      },
      {
        name: "Honda Fit Hybrid Battery",
        description: "Replacement hybrid battery for Honda Fit 2013-2019. Authentic OEM quality with installation service.",
        category: "hybrid-batteries",
        imageUrl: "/attached_assets/battery2.png"
      },
      {
        name: "Toyota Fortuner Body Parts",
        description: "Genuine Toyota body parts for Fortuner 2016-2022. Includes headlights, tail lamps, grills and bumpers.",
        category: "body-parts",
        imageUrl: "/attached_assets/image4.jpg"
      },
      {
        name: "Hilux Windshield Washer Nozzle",
        description: "Genuine windshield washer nozzle for Toyota Hilux D4D. Quality replacement part with fitting service.",
        category: "accessories",
        imageUrl: "/attached_assets/image1.jpg"
      },
      {
        name: "Nissan X-Trail Complete Engine",
        description: "Complete engine assembly for Nissan X-Trail T32 hybrid models. Genuine parts with professional installation.",
        category: "engines",
        imageUrl: "/attached_assets/image.jpg"
      }
    ];
    sampleProducts.forEach((product) => {
      this.createProduct(product);
    });
  }
  // User methods
  async getUser(id) {
    return this.users.get(id);
  }
  async getUserByUsername(username) {
    return Array.from(this.users.values()).find(
      (user) => user.username === username
    );
  }
  async createUser(insertUser) {
    const id = this.currentUserId++;
    const user = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  // Quote methods
  async createQuote(insertQuote) {
    const id = this.currentQuoteId++;
    const quote = {
      ...insertQuote,
      id,
      createdAt: /* @__PURE__ */ new Date()
    };
    this.quotes.set(id, quote);
    return quote;
  }
  async getQuotes() {
    return Array.from(this.quotes.values());
  }
  async getQuote(id) {
    return this.quotes.get(id);
  }
  // Product methods
  async getProducts() {
    return Array.from(this.products.values());
  }
  async getProduct(id) {
    return this.products.get(id);
  }
  async getProductsByCategory(category) {
    return Array.from(this.products.values()).filter(
      (product) => product.category === category
    );
  }
  async createProduct(insertProduct) {
    const id = this.currentProductId++;
    const product = {
      ...insertProduct,
      id,
      imageUrl: insertProduct.imageUrl || null
    };
    this.products.set(id, product);
    return product;
  }
};
var storage = new MemStorage();

// shared/schema.ts
import { pgTable, text, serial, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
var users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull()
});
var quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  vehicleMake: text("vehicle_make").notNull(),
  vehicleModel: text("vehicle_model").notNull(),
  serviceRequired: text("service_required").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull()
});
var products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  imageUrl: text("image_url")
});
var insertQuoteSchema = createInsertSchema(quotes).omit({
  id: true,
  createdAt: true
});
var insertProductSchema = createInsertSchema(products).omit({
  id: true
});
var insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true
});

// server/routes.ts
import { z } from "zod";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
async function registerRoutes(app2) {
  app2.use("/attached_assets", express.static(path.join(__dirname, "../attached_assets")));
  app2.get("/api/products", async (req, res) => {
    try {
      const products2 = await storage.getProducts();
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });
  app2.get("/api/products/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const products2 = await storage.getProductsByCategory(category);
      res.json(products2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products by category" });
    }
  });
  app2.get("/api/products/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await storage.getProduct(id);
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });
  app2.post("/api/quotes", async (req, res) => {
    try {
      const quoteData = insertQuoteSchema.parse(req.body);
      const quote = await storage.createQuote(quoteData);
      res.status(201).json(quote);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          message: "Validation error",
          errors: error.errors
        });
      }
      res.status(500).json({ message: "Failed to create quote request" });
    }
  });
  app2.get("/api/quotes", async (req, res) => {
    try {
      const quotes2 = await storage.getQuotes();
      res.json(quotes2);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch quotes" });
    }
  });
  const httpServer = createServer(app2);
  return httpServer;
}

// server/vite.ts
import express2 from "express";
import fs from "fs";
import path3 from "path";
import { createServer as createViteServer, createLogger } from "vite";

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path2 from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
      await import("@replit/vite-plugin-cartographer").then(
        (m) => m.cartographer()
      )
    ] : []
  ],
  resolve: {
    alias: {
      "@": path2.resolve(import.meta.dirname, "client", "src"),
      "@shared": path2.resolve(import.meta.dirname, "shared"),
      "@assets": path2.resolve(import.meta.dirname, "attached_assets")
    }
  },
  root: path2.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path2.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"]
    }
  }
});

// server/vite.ts
import { nanoid } from "nanoid";
var viteLogger = createLogger();
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path3.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path3.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express2.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path3.resolve(distPath, "index.html"));
  });
}

// server/index.ts
var app = express3();
app.use(express3.json());
app.use(express3.urlencoded({ extended: false }));
app.use((req, res, next) => {
  const start = Date.now();
  const path4 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path4.startsWith("/api")) {
      let logLine = `${req.method} ${path4} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      log(logLine);
    }
  });
  next();
});
(async () => {
  const server = await registerRoutes(app);
  app.use((err, _req, res, _next) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }
  const port = 5e3;
  server.listen({
    port,
    host: "0.0.0.0"
  }, () => {
    log(`serving on port ${port}`);
  });
})();
