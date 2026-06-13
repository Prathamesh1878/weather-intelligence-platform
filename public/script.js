let map;
let marker;
let tempChart;

async function getWeather(){

    const city =
    document.getElementById("city").value;

    if(!city){
        alert("Enter city name");
        return;
    }

    try{

        const response =
        await fetch(`/weather/${city}`);

        const data =
        await response.json();

        displayWeather(data);
        getAQI(
            data.coord.lat,
            data.coord.lon
        );

        getForecast(city);

        initMap(
            data.coord.lat,
            data.coord.lon,
            data.name
        );

    }
    catch(error){

        alert("City not found");

    }

}

function getCurrentLocationWeather(){

    navigator.geolocation.getCurrentPosition(
        async (position) => {

            const lat =
            position.coords.latitude;

            const lon =
            position.coords.longitude;

            const response =
            await fetch(
                `/weather/location/${lat}/${lon}`
            );

            const data =
            await response.json();

            displayWeather(data);
            getAQI(
                data.coord.lat,
                data.coord.lon
            );

            getForecast(data.name);

            initMap(
                data.coord.lat,
                data.coord.lon,
                data.name
            );

        },
        () => {

            alert(
                "Location access denied"
            );

        }
    );

}

function displayWeather(data){

    document.getElementById(
        "weather"
    ).innerHTML = `

        <h2>${data.name}</h2>

        <img
        src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

        <p><b>Temperature:</b> ${data.main.temp} °C</p>

        <p><b>Humidity:</b> ${data.main.humidity}%</p>

        <p><b>Wind Speed:</b> ${data.wind.speed} m/s</p>

        <p><b>Weather:</b> ${data.weather[0].description}</p>

    `;
}

async function getForecast(city){

    const response =
    await fetch(`/forecast/${city}`);

    const data =
    await response.json();

    let forecastHTML = "";

    const dailyForecasts =
    data.list.filter(
        (item,index) => index % 8 === 0
    );

    createTemperatureChart(
        dailyForecasts
    );

    dailyForecasts.forEach(day => {

        forecastHTML += `

        <div class="forecast-card">

            <h4>
            ${
                new Date(day.dt_txt)
                .toLocaleDateString()
            }
            </h4>

            <img
            src="https://openweathermap.org/img/wn/${day.weather[0].icon}@2x.png">

            <p>
            ${day.main.temp} °C
            </p>

            <p>
            ${day.weather[0].description}
            </p>

        </div>

        `;

    });

    document.getElementById(
        "forecast"
    ).innerHTML = forecastHTML;

}
async function getAQI(lat,lon){

    const response =
    await fetch(`/aqi/${lat}/${lon}`);

    const data =
    await response.json();

    displayAQI(data);

}
function displayAQI(data){

    const aqi =
    data.list[0].main.aqi;

    const components =
    data.list[0].components;

    document.getElementById(
        "aqi"
    ).innerHTML = `

        <h2>Air Quality Index</h2>

        <p><b>AQI:</b> ${aqi}</p>

        <p><b>PM2.5:</b>
        ${components.pm2_5}</p>

        <p><b>PM10:</b>
        ${components.pm10}</p>

        <p><b>CO:</b>
        ${components.co}</p>

    `;
}
function createTemperatureChart(data){

    const labels =
    data.map(item =>
        new Date(item.dt_txt)
        .toLocaleDateString()
    );

    const temperatures =
    data.map(item =>
        item.main.temp
    );

    if(tempChart){
        tempChart.destroy();
    }

    const ctx =
    document.getElementById(
        "tempChart"
    );

    tempChart = new Chart(ctx, {

        type: "line",

        data: {

            labels: labels,

            datasets: [{
                label: "Temperature °C",
                data: temperatures
            }]

        }

    });

}

function initMap(lat,lng,city){

    if(map){
        map.remove();
    }

    map = L.map("map").setView(
        [lat,lng],
        10
    );

    L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
            attribution:
            "&copy; OpenStreetMap Contributors"
        }
    ).addTo(map);

    marker = L.marker(
        [lat,lng]
    ).addTo(map);

    marker.bindPopup(city)
          .openPopup();

}
function toggleTheme(){

    document.body.classList.toggle(
        "dark-mode"
    );

    localStorage.setItem(
        "theme",
        document.body.classList.contains(
            "dark-mode"
        )
        ? "dark"
        : "light"
    );

}
window.onload = () => {

    const theme =
    localStorage.getItem(
        "theme"
    );

    if(theme === "dark"){

        document.body.classList.add(
            "dark-mode"
        );

    }

};