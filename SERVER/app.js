import { config } from 'dotenv';  // Import dotenv
config();  // Load .env file
import express from 'express';
import userRoutes from './routes/user-routes.js';
import applyCommonMiddlewares from './middlewares/common-middlewares.js';


const app = express();
applyCommonMiddlewares(app);

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.all('*', (req, res) => {
  res.status(404).send('OOPS! Page not found');
});

app.use('/user', userRoutes);


export default app;
