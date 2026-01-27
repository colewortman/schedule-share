// src/app.ts
import express from "express";
import cors from "cors";
import UserRoutes from "./routes/UserRoutes";
import GroupRoutes from "./routes/GroupRoutes";
import ScheduleRoutes from "./routes/ScheduleRoutes";

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
  app.use("/api", UserRoutes);
  app.use("/api", GroupRoutes);
  app.use("/api", ScheduleRoutes);

  return app;
}
