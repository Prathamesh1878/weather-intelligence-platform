require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));
console.log("Mongo URI:", process.env.MONGODB_URI);
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.log(err);
  });

/* =========================
   AUTH ROUTES
========================= */

app.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({
      username,
    });

    if (existingUser) {
      return res.status(400).json({
        error: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const user = new User({
      username,
      password: hashedPassword,
    });

    await user.save();

    res.json({
      message: "User Registered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      error: "Registration Failed",
    });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { username, password } =
      req.body;

    const user = await User.findOne({
      username,
    });

    if (!user) {
      return res.status(400).json({
        error: "User Not Found",
      });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {
      return res.status(400).json({
        error: "Invalid Password",
      });
    }

    res.json({
      message: "Login Successful",
    });
  } catch (error) {
    res.status(500).json({
      error: "Login Failed",
    });
  }
});

/* =========================
   WEATHER ROUTES
========================= */

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response =
      await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "City not found",
    });
  }
});

app.get(
  "/weather/location/:lat/:lon",
  async (req, res) => {
    try {
      const { lat, lon } =
        req.params;

      const response =
        await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );

      res.json(response.data);
    } catch (error) {
      res.status(500).json({
        error:
          "Location weather not found",
      });
    }
  }
);

app.get("/forecast/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response =
      await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
      );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "Forecast not found",
    });
  }
});

app.get("/aqi/:lat/:lon", async (req, res) => {
  try {
    const { lat, lon } =
      req.params;

    const response =
      await axios.get(
        `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
      );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "AQI data not found",
    });
  }
});

/* =========================
   SERVER
========================= */

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});