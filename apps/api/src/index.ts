import dbClient from './dbconfig';
import { createApp } from './app';

async function startServer() {
  try {
    await dbClient.connect();
    console.log("Connected to the database successfully.");

    const app = createApp();

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
}

startServer();


