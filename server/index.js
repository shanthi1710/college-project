import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { preventServerSleep } from "./preventServerSleep.js";

import connectDB from "./mongodb/connectDB/connectDB.js";
import userRouter from "./routes/userModel.routes.js";
import appliedPlacementsRouter from "./routes/appliedPlacementsModel.routes.js";
import adminRouter from "./routes/adminModel.routes.js";
import placementsRouter from "./routes/placementsModel.routes.js";
import userNotificationsRouter from "./routes/userNotificationModel.routes.js";
import adminNotificationRouter from "./routes/adminNotificationModel.routes.js";

dotenv.config();
const app = express();

app.use(express.json({ limit: "50mb" }));
app.use(
  cors({
    origin: process.env.CLIENT_DOMAIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.use("/api/user", userRouter);
app.use("/api/appliedplacements", appliedPlacementsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/placements", placementsRouter);
app.use("/api/usernotifications", userNotificationsRouter);
app.use("/api/adminnotifications", adminNotificationRouter);

const startServer = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(PORT, () => {
      preventServerSleep();
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server cannot start:", error);
  }
};

startServer();
