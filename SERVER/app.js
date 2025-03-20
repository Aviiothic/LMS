import express from 'express';
import userRoutes from './routes/user-routes.js';
import applyCommonMiddlewares from './middlewares/common-middlewares.js';
import morgan from 'morgan'; // Logs HTTP requests
import connectToMongoDb from './configs/database-connection.js';
import { config } from 'dotenv';
import errorMiddleware from './middlewares/error-middleware.js';

config();  // Load environment variables
connectToMongoDb(process.env.MONGO_DB_URL);  // Connect to MongoDB

const app = express();
applyCommonMiddlewares(app);
app.use(morgan('dev'));  // Request logging

app.get('/', (req, res) => res.send('Hello, World!')); // Root route

app.use('/user', userRoutes);  // Mount user routes
app.all('*', (req, res) => res.status(404).send('OOPS! Page not found')); // Catch-all 404 handler

app.use(errorMiddleware); // Global error handler

export default app;
