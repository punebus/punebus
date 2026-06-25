import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import "express-async-errors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/admin.js";
import enquiryRoutes from "./routes/enquiry.js";
import panelRoutes from "./routes/panel.js";
import providerRoutes from "./routes/provider.js";
import panelConfigRoutes from "./routes/panelConfig.js";
import { errorHandler } from "./middleware/errorHandler.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: "5mb" }));

// Connect DB
connectDB(process.env.MONGO_URI || "mongodb://localhost:27017/Punebus");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/providers", providerRoutes);
app.use("/api/panel-config", panelConfigRoutes);
app.use("/api/panels", panelRoutes);

// health
app.get("/", (req, res) => res.send("PuneBus Backend Running"));

// error handler
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

server.on("error", (error) => {
  if (error.code === "EADDRINUSE") {
    console.error(`Port ${PORT} is already in use. Please stop the process using this port or set PORT to a different value.`);
    process.exit(1);
  }
  throw error;
});
