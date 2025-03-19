const port = 3000;
const app = require('./app');
const userRoutes = require('./routes/user-routes');

app.use('/user', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
