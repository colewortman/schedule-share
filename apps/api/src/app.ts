// src/app.ts
import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  app.use(express.json());
  app.use("/", UserRoutes);

  return app;
}
