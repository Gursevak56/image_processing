// src/server.ts
import express from 'express';
import path from 'path';
import { mongoConnect } from './config/db';
import routes from './routes';
import './worker/imageProcessor'; // Import to initialize and start processing jobs

const app = express();
const PORT = process.env.PORT || 3000;

mongoConnect();

app.use(express.json());

// Serve processed images statically
app.use('/processed_images', express.static(path.join(__dirname, 'processed_images')));

// Use the routes defined in the routes folder
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
