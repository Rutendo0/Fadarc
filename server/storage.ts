import { type Quote, type Product, type User, type InsertQuote, type InsertProduct, type InsertUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Quote methods
  createQuote(quote: InsertQuote): Promise<Quote>;
  getQuotes(): Promise<Quote[]>;
  getQuote(id: number): Promise<Quote | undefined>;
  
  // Product methods
  getProducts(): Promise<Product[]>;
  getProduct(id: number): Promise<Product | undefined>;
  getProductsByCategory(category: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private quotes: Map<number, Quote>;
  private products: Map<number, Product>;
  private currentUserId: number;
  private currentQuoteId: number;
  private currentProductId: number;

  constructor() {
    this.users = new Map();
    this.quotes = new Map();
    this.products = new Map();
    this.currentUserId = 1;
    this.currentQuoteId = 1;
    this.currentProductId = 1;
    
    // Initialize with some sample products
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
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
    
    sampleProducts.forEach(product => {
      this.createProduct(product);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Quote methods
  async createQuote(insertQuote: InsertQuote): Promise<Quote> {
    const id = this.currentQuoteId++;
    const quote: Quote = { 
      ...insertQuote, 
      id, 
      createdAt: new Date() 
    };
    this.quotes.set(id, quote);
    return quote;
  }

  async getQuotes(): Promise<Quote[]> {
    return Array.from(this.quotes.values());
  }

  async getQuote(id: number): Promise<Quote | undefined> {
    return this.quotes.get(id);
  }

  // Product methods
  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProduct(id: number): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      product => product.category === category
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = this.currentProductId++;
    const product: Product = { 
      ...insertProduct, 
      id,
      imageUrl: insertProduct.imageUrl || null
    };
    this.products.set(id, product);
    return product;
  }
}

export const storage = new MemStorage();
