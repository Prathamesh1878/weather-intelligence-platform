require("dotenv").config();

const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.static("public"));

app.get("/weather/:city", async (req, res) => {
  try {
    const city = req.params.city;

    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({
      error: "City not found",
    });
  }
});
app.get("/weather/location/:lat/:lon", async (req, res) => {

    try {

        const { lat, lon } = req.params;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "Location weather not found"
        });

    }

});
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
app.get("/forecast/:city", async (req, res) => {

    try {

        const city = req.params.city;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${process.env.WEATHER_API_KEY}&units=metric`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "Forecast not found"
        });

    }

});
app.get("/aqi/:lat/:lon", async (req, res) => {

    try {

        const { lat, lon } = req.params;

        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${process.env.WEATHER_API_KEY}`
        );

        res.json(response.data);

    } catch (error) {

        res.status(500).json({
            error: "AQI data not found"
        });

    }

});