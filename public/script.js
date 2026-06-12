let map;
let marker;

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

        document.getElementById("weather").innerHTML = `

            <h2>${data.name}</h2>

            <img
            src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png">

            <p><b>Temperature:</b> ${data.main.temp} °C</p>

            <p><b>Humidity:</b> ${data.main.humidity}%</p>

            <p><b>Wind Speed:</b> ${data.wind.speed} m/s</p>

            <p><b>Weather:</b> ${data.weather[0].description}</p>

        `;

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