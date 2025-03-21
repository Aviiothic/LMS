import app from './app.js';
import cloudinary from 'cloudinary';
const port = process.env.PORT || 8080;


//cloudinary configuration
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.C,
});



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
