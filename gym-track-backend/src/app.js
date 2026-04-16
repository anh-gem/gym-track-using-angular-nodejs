const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const app = express();

// Middlewares
app.use(express.json()); // parse JSON
app.use(express.urlencoded({ extended: true }));

//TEMP CORS
app.use(
  cors({
    origin: "https://mygymtrack.netlify.app",
    credentials: true,
  }),
);
app.use(morgan("dev")); // logging
app.use(cookieParser());

// Routes
const authRoutes = require("./routes/auth.routes");
const memberRoutes = require("./routes/member.routes");
const workoutRoutes = require("./routes/workout.routes");
const orderRoutes = require("./routes/order.routes");

app.use("/api/auth", authRoutes);
app.use("/api/members", memberRoutes);
app.use("/api/workouts", workoutRoutes);
app.use("/api/order", orderRoutes);
// Health check route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
});

//Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);

  res.status(500).json({
    message: err.message || "Something went wrong",
  });
});

module.exports = app;
