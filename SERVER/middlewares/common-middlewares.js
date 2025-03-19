import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Import required for __dirname equivalent
import methodOverride from 'method-override';
import cors from 'cors';
import cookieParser from 'cookie-parser';

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function applyCommonMiddlewares(app) {
    app.set('view engine', 'ejs');  // Enable server-side rendering with EJS
    app.set('views', path.join(__dirname, '..', 'views'));  // Set path for view files
    app.use(express.json());  // Parse JSON data in request body
    app.use(express.urlencoded({ extended: true })); // Parse form data in req.body (POST)
    app.use(methodOverride('_method')); // Enable PATCH, PUT, DELETE via HTTP requests
    app.use(express.static(path.join(__dirname, '..', 'public')));  // Serve static files correctly
    app.use(cookieParser());

    app.use(cors({
        origin: [process.env.FRONTEND_URL],
        credentials: true
    }));
}

export default applyCommonMiddlewares;
