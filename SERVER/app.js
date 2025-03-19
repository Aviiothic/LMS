import express from 'express';
import userRoutes from './routes/user-routes.js';
import applyCommonMiddlewares from './middlewares/common-middlewares.js';
import morgan from 'morgan';
import connectToMongoDb from './configs/database-connection.js';
import { config } from 'dotenv';  // Import dotenv
import errorMiddleware from './middlewares/error-middleware.js';
config();  // Load .env file

const mongoDbUrl = process.env.MONGO_DB_URL;
connectToMongoDb(mongoDbUrl);

const app = express();
applyCommonMiddlewares(app);

app.use(morgan('dev')); // to log details about requests

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.all('*', (req, res) => {
  res.status(404).send('OOPS! Page not found');
});

app.use(errorMiddleware);
app.use('/user', userRoutes);


export default app;
