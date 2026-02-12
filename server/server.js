import http from 'http';
import app from './app.js';
import { config } from './config/env.js';
import connectDB from './config/db.js';

const port = config.port;
const server = http.createServer(app);

async function start() {
  try {
    await connectDB();
    server.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });


  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
