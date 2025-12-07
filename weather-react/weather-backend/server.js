// server.js

// 1) Load environment variables
require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// 2) Middlewares
app.use(
  cors({
    origin: "http://localhost:5173", // React dev server
  })
);
app.use(express.json()); // Parse JSON request bodies

// 3) Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// 4) Define Weather schema & model
const weatherSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    temperature: { type: Number, required: true }, // in °C
    windspeed: { type: Number, required: true },   // in m/s
  },
  { timestamps: true }
);

const Weather = mongoose.model("Weather", weatherSchema);

// 5) Routes

// Simple test route
app.get("/", (req, res) => {
  res.send("Weather backend is running 🌦️");
});

// POST /api/weather  -> save one weather record
app.post("/api/weather", async (req, res) => {
  try {
    const { city, temperature, windspeed } = req.body;

    if (!city || temperature == null || windspeed == null) {
      return res
        .status(400)
        .json({ message: "city, temperature and windspeed are required" });
    }

    const record = await Weather.create({
      city,
      temperature,
      windspeed,
    });

    return res.status(201).json(record);
  } catch (err) {
    console.error("Error saving weather:", err);
    return res.status(500).json({ message: "Error saving weather" });
  }
});

// GET /api/weather  -> get ALL weather records (history)
app.get("/api/weather", async (req, res) => {
  try {
    const records = await Weather.find().sort({ createdAt: -1 });
    return res.json(records);
  } catch (err) {
    console.error("Error fetching weather history:", err);
    return res
      .status(500)
      .json({ message: "Error fetching weather history" });
  }
});

// GET /api/weather/:city  -> get LATEST weather for that city
app.get("/api/weather/:city", async (req, res) => {
  try {
    const cityParam = req.params.city;

    // Case-insensitive exact match, get latest record
    const record = await Weather.findOne({
      city: new RegExp(`^${cityParam}$`, "i"),
    }).sort({ createdAt: -1 });

    if (!record) {
      return res
        .status(404)
        .json({ message: "No weather data for this city yet" });
    }

    return res.json(record);
  } catch (err) {
    console.error("Error fetching city weather:", err);
    return res.status(500).json({ message: "Error fetching city weather" });
  }
});

// 6) Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
