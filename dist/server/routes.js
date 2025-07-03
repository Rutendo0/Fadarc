import { createServer } from "http";
import { storage } from "./storage.js";
import { insertQuoteSchema } from "../shared/schema.js";
import { z } from "zod";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import multer from "multer";
import { v2 as cloudinary } from 'cloudinary';
import sharp from 'sharp';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
// Configure multer for memory storage (for cloud upload)
const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        }
        else {
            cb(new Error('Only image files are allowed'));
        }
    }
});
// Compress image with Sharp
async function compressImage(buffer) {
    return await sharp(buffer)
        .resize(1200, 800, {
        fit: 'inside',
        withoutEnlargement: true
    })
        .jpeg({
        quality: 85,
        progressive: true
    })
        .toBuffer();
}
// Upload to Cloudinary with compression
async function uploadToCloudinary(file) {
    try {
        // Compress the image first
        const compressedBuffer = await compressImage(file.buffer);
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({
                folder: 'blog-images',
                resource_type: 'image',
                transformation: [
                    { quality: 'auto', fetch_format: 'auto' }
                ]
            }, (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    reject(error);
                }
                else {
                    console.log('Image uploaded successfully:', result?.secure_url);
                    resolve(result.secure_url);
                }
            }).end(compressedBuffer);
        });
    }
    catch (error) {
        console.error('Image compression error:', error);
        throw error;
    }
}
export async function registerRoutes(app) {
    // Serve static files from attached_assets
    app.use('/attached_assets', express.static(path.join(__dirname, '../attached_assets')));
    // File upload endpoint for blog images
    app.post("/api/upload/blog-image", upload.single('image'), async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ message: "No file uploaded" });
            }
            // Check Cloudinary configuration
            if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
                return res.status(500).json({
                    message: "Cloudinary configuration missing. Please set up environment variables."
                });
            }
            // Upload to Cloudinary
            const imageUrl = await uploadToCloudinary(req.file);
            // Track file metadata in database
            const fileMetadata = await storage.createUploadedFile({
                originalName: req.file.originalname,
                fileName: `blog_${Date.now()}_${req.file.originalname}`,
                fileSize: req.file.size,
                mimeType: req.file.mimetype,
                cloudUrl: imageUrl
            });
            res.json({
                imageUrl,
                fileId: fileMetadata.id,
                message: "Image uploaded successfully"
            });
        }
        catch (error) {
            console.error("Upload error:", error);
            res.status(500).json({
                message: "Failed to upload image",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });
    // Get all products
    app.get("/api/products", async (req, res) => {
        try {
            const products = await storage.getProducts();
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch products" });
        }
    });
    // Get products by category
    app.get("/api/products/category/:category", async (req, res) => {
        try {
            const { category } = req.params;
            const products = await storage.getProductsByCategory(category);
            res.json(products);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch products by category" });
        }
    });
    // Get single product
    app.get("/api/products/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const product = await storage.getProduct(id);
            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }
            res.json(product);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch product" });
        }
    });
    // Create quote request
    app.post("/api/quotes", async (req, res) => {
        try {
            const quoteData = insertQuoteSchema.parse(req.body);
            const quote = await storage.createQuote(quoteData);
            res.status(201).json(quote);
        }
        catch (error) {
            if (error instanceof z.ZodError) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: error.errors
                });
            }
            res.status(500).json({ message: "Failed to create quote request" });
        }
    });
    // Get all quotes (admin functionality)
    app.get("/api/quotes", async (req, res) => {
        try {
            const quotes = await storage.getQuotes();
            res.json(quotes);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to fetch quotes" });
        }
    });
    // Blog routes
    app.get("/api/blog", async (req, res) => {
        try {
            const posts = await storage.getBlogPosts();
            res.json(posts);
        }
        catch (error) {
            console.error("Error fetching blog posts:", error);
            res.status(500).json({ message: "Failed to fetch blog posts" });
        }
    });
    app.get("/api/blog/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            if (isNaN(id)) {
                return res.status(400).json({ message: "Invalid blog post ID" });
            }
            const post = await storage.getBlogPost(id);
            if (!post) {
                return res.status(404).json({ message: "Blog post not found" });
            }
            res.json(post);
        }
        catch (error) {
            console.error("Error fetching blog post:", error);
            res.status(500).json({ message: "Failed to fetch blog post" });
        }
    });
    app.post("/api/blog", async (req, res) => {
        try {
            const postData = req.body;
            const post = await storage.createBlogPost(postData);
            res.status(201).json(post);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to create blog post" });
        }
    });
    app.put("/api/blog/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const postData = req.body;
            const post = await storage.updateBlogPost(id, postData);
            if (!post) {
                return res.status(404).json({ message: "Blog post not found" });
            }
            res.json(post);
        }
        catch (error) {
            res.status(500).json({ message: "Failed to update blog post" });
        }
    });
    app.delete("/api/blog/:id", async (req, res) => {
        try {
            const id = parseInt(req.params.id);
            const success = await storage.deleteBlogPost(id);
            if (!success) {
                return res.status(404).json({ message: "Blog post not found" });
            }
            res.json({ message: "Blog post deleted successfully" });
        }
        catch (error) {
            res.status(500).json({ message: "Failed to delete blog post" });
        }
    });
    // Test endpoint for Cloudinary configuration
    app.get("/api/test/cloudinary", async (req, res) => {
        const isConfigured = !!(process.env.CLOUDINARY_CLOUD_NAME &&
            process.env.CLOUDINARY_API_KEY &&
            process.env.CLOUDINARY_API_SECRET);
        res.json({
            configured: isConfigured,
            cloudName: process.env.CLOUDINARY_CLOUD_NAME ? "✓ Set" : "✗ Missing",
            apiKey: process.env.CLOUDINARY_API_KEY ? "✓ Set" : "✗ Missing",
            apiSecret: process.env.CLOUDINARY_API_SECRET ? "✓ Set" : "✗ Missing"
        });
    });
    // Simple admin authentication
    app.post("/api/admin/login", async (req, res) => {
        const { password } = req.body;
        if (password === "admin123") { // Change this to a secure password
            res.json({ token: "admin-token" });
        }
        else {
            res.status(401).json({ message: "Invalid password" });
        }
    });
    app.get("/api/admin/verify", async (req, res) => {
        const token = req.headers.authorization?.replace("Bearer ", "");
        if (token === "admin-token") {
            res.json({ valid: true });
        }
        else {
            res.status(401).json({ message: "Invalid token" });
        }
    });
    const httpServer = createServer(app);
    return httpServer;
}
