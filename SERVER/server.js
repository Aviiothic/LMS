import app from './app.js';
console.log('PORT from env:', process.env.PORT);
const port = process.env.PORT || 8080;



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
