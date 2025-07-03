import { users, quotes, products, blogPosts, uploadedFiles } from "../shared/schema.js";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
// PostgreSQL Storage - Production Ready
export class PostgreSQLStorage {
    db;
    constructor() {
        if (!process.env.DATABASE_URL) {
            throw new Error("DATABASE_URL environment variable is required for PostgreSQL storage");
        }
        const sql = postgres(process.env.DATABASE_URL);
        this.db = drizzle(sql);
    }
    // User methods
    async getUser(id) {
        const result = await this.db.select().from(users).where(eq(users.id, id));
        return result[0];
    }
    async getUserByUsername(username) {
        const result = await this.db.select().from(users).where(eq(users.username, username));
        return result[0];
    }
    async createUser(insertUser) {
        const result = await this.db.insert(users).values(insertUser).returning();
        return result[0];
    }
    // Quote methods
    async createQuote(insertQuote) {
        const result = await this.db.insert(quotes).values(insertQuote).returning();
        return result[0];
    }
    async getQuotes() {
        return await this.db.select().from(quotes);
    }
    async getQuote(id) {
        const result = await this.db.select().from(quotes).where(eq(quotes.id, id));
        return result[0];
    }
    // Product methods
    async getProducts() {
        return await this.db.select().from(products);
    }
    async getProduct(id) {
        const result = await this.db.select().from(products).where(eq(products.id, id));
        return result[0];
    }
    async getProductsByCategory(category) {
        return await this.db.select().from(products).where(eq(products.category, category));
    }
    async createProduct(insertProduct) {
        const result = await this.db.insert(products).values(insertProduct).returning();
        return result[0];
    }
    // Blog methods
    async getBlogPosts() {
        return await this.db.select().from(blogPosts).where(eq(blogPosts.published, true));
    }
    async getBlogPost(id) {
        const result = await this.db.select().from(blogPosts).where(eq(blogPosts.id, id));
        return result[0];
    }
    async createBlogPost(insertBlogPost) {
        const result = await this.db.insert(blogPosts).values(insertBlogPost).returning();
        return result[0];
    }
    async updateBlogPost(id, updateData) {
        const result = await this.db
            .update(blogPosts)
            .set({ ...updateData, updatedAt: new Date() })
            .where(eq(blogPosts.id, id))
            .returning();
        return result[0];
    }
    async deleteBlogPost(id) {
        const result = await this.db.delete(blogPosts).where(eq(blogPosts.id, id));
        return result.length > 0;
    }
    // File upload methods
    async createUploadedFile(insertFile) {
        const result = await this.db.insert(uploadedFiles).values(insertFile).returning();
        return result[0];
    }
    async getUploadedFiles() {
        return await this.db.select().from(uploadedFiles);
    }
}
// Memory Storage - For Development/Testing
export class MemStorage {
    users;
    quotes;
    products;
    blogPosts;
    currentUserId;
    currentQuoteId;
    currentProductId;
    currentBlogPostId;
    constructor() {
        this.users = new Map();
        this.quotes = new Map();
        this.products = new Map();
        this.blogPosts = new Map();
        this.currentUserId = 1;
        this.currentQuoteId = 1;
        this.currentProductId = 1;
        this.currentBlogPostId = 1;
        this.initializeProducts();
        this.initializeBlogPosts();
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
            }
        ];
        sampleProducts.forEach(product => {
            this.createProduct(product);
        });
    }
    initializeBlogPosts() {
        const samplePosts = [
            {
                title: "Understanding Hybrid Battery Technology",
                content: "Hybrid batteries are the heart of any hybrid vehicle...",
                excerpt: "Learn about the technology behind hybrid batteries and how proper maintenance can extend their lifespan.",
                category: "Hybrid Technology",
                imageUrl: "/attached_assets/battery2.png",
                published: true
            }
        ];
        samplePosts.forEach(post => {
            this.createBlogPost(post);
        });
    }
    async getUser(id) {
        return this.users.get(id);
    }
    async getUserByUsername(username) {
        return Array.from(this.users.values()).find(user => user.username === username);
    }
    async createUser(insertUser) {
        const id = this.currentUserId++;
        const user = { ...insertUser, id };
        this.users.set(id, user);
        return user;
    }
    async createQuote(insertQuote) {
        const id = this.currentQuoteId++;
        const quote = { ...insertQuote, id, createdAt: new Date() };
        this.quotes.set(id, quote);
        return quote;
    }
    async getQuotes() {
        return Array.from(this.quotes.values());
    }
    async getQuote(id) {
        return this.quotes.get(id);
    }
    async getProducts() {
        return Array.from(this.products.values());
    }
    async getProduct(id) {
        return this.products.get(id);
    }
    async getProductsByCategory(category) {
        return Array.from(this.products.values()).filter(product => product.category === category);
    }
    async createProduct(insertProduct) {
        const id = this.currentProductId++;
        const product = { ...insertProduct, id, imageUrl: insertProduct.imageUrl || null };
        this.products.set(id, product);
        return product;
    }
    async getBlogPosts() {
        return Array.from(this.blogPosts.values()).filter(post => post.published);
    }
    async getBlogPost(id) {
        return this.blogPosts.get(id);
    }
    async createBlogPost(insertBlogPost) {
        const id = this.currentBlogPostId++;
        const now = new Date();
        const blogPost = {
            id,
            category: insertBlogPost.category,
            title: insertBlogPost.title,
            content: insertBlogPost.content,
            excerpt: insertBlogPost.excerpt,
            imageUrl: insertBlogPost.imageUrl ?? null,
            published: insertBlogPost.published ?? false,
            createdAt: now,
            updatedAt: now
        };
        this.blogPosts.set(id, blogPost);
        return blogPost;
    }
    async updateBlogPost(id, updateData) {
        const existingPost = this.blogPosts.get(id);
        if (!existingPost)
            return undefined;
        const updatedPost = { ...existingPost, ...updateData, updatedAt: new Date() };
        this.blogPosts.set(id, updatedPost);
        return updatedPost;
    }
    async deleteBlogPost(id) {
        return this.blogPosts.delete(id);
    }
    // File upload methods
    async createUploadedFile(insertFile) {
        const id = Date.now(); // Simple ID for memory storage
        const uploadedFile = {
            id,
            originalName: insertFile.originalName,
            fileName: insertFile.fileName,
            fileSize: insertFile.fileSize,
            mimeType: insertFile.mimeType,
            cloudUrl: insertFile.cloudUrl ?? null,
            uploadedAt: new Date()
        };
        return uploadedFile;
    }
    async getUploadedFiles() {
        return []; // Not implemented for memory storage
    }
}
// Automatically use PostgreSQL if DATABASE_URL is set, otherwise use MemStorage
export const storage = process.env.DATABASE_URL
    ? new PostgreSQLStorage()
    : new MemStorage();
console.log(`Using ${process.env.DATABASE_URL ? 'PostgreSQL' : 'Memory'} storage`);
