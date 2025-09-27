import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import "express-async-errors";
import { connectDB } from "./utils/db";
import authRoutes from "./routes/auth.routes";
import courierRoutes from "./routes/courier.routes";
import analyticsRoutes from "./routes/analytics.routes";
import sosRoutes from "./routes/sos.routes";
import { errorHandler } from "./middleware/error.middleware";
import userRoutes from "./routes/user.routes";

dotenv.config();

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "5mb" }));
app.use(morgan("dev"));

app.use("/auth", authRoutes);
app.use("/couriers", courierRoutes);
app.use("/analytics", analyticsRoutes);
app.use("/sos", sosRoutes);
app.use("/users", userRoutes);

app.use(errorHandler);

const PORT = Number(process.env.PORT || 8000);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`NCSTCS backend running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
  process.exit(1);
});
