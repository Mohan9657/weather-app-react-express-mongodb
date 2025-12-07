// weather-backend/server.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ Allow all origins (works for localhost + Vercel)
app.use(cors());
app.use(express.json());

// ✅ Environment variables
const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

// ✅ Connect to MongoDB (no deprecated options)
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ Mongo connection error:", err.message);
  });

// ✅ Schema & model
const weatherSchema = new mongoose.Schema(
  {
    city: { type: String, required: true, unique: true },
    temperature: { type: Number, required: true },
    windspeed: { type: Number, required: true },
  },
  { timestamps: true }
);

const Weather = mongoose.model("Weather", weatherSchema);

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Weather backend is running 🌦️");
});

// ✅ Add / update weather
app.post("/api/weather", async (req, res) => {
  try {
    const { city, temperature, windspeed } = req.body;

    if (!city || temperature == null || windspeed == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const updated = await Weather.findOneAndUpdate(
      { city },
      { city, temperature, windspeed },
      { new: true, upsert: true }
    );

    res.status(201).json(updated);
  } catch (err) {
    console.error("POST /api/weather error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Get weather by city
app.get("/api/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;
    const entry = await Weather.findOne({ city });

    if (!entry) {
      return res.status(404).json({ message: "City not found" });
    }

    res.json(entry);
  } catch (err) {
    console.error("GET /api/weather/:city error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
