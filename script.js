
const weatherForm = document.getElementById("weatherForm");
const cityInput = document.getElementById("cityInput");
const searchButton = document.getElementById("searchButton");
const message = document.getElementById("message");
const weatherResult = document.getElementById("weatherResult");

const cityName = document.getElementById("cityName");
const weatherDescription = document.getElementById("weatherDescription");
const temperature = document.getElementById("temperature");
const humidity = document.getElementById("humidity");
const windSpeed = document.getElementById("windSpeed");
const feelsLike = document.getElementById("feelsLike");
const updatedTime = document.getElementById("updatedTime");

// Convert weather codes into readable conditions
function getWeatherDescription(code) {
    const conditions = {
        0: "Clear Sky ☀️",
        1: "Mainly Clear 🌤️",
        2: "Partly Cloudy ⛅",
        3: "Overcast ☁️",
        45: "Foggy 🌫️",
        48: "Depositing Rime Fog 🌫️",
        51: "Light Drizzle 🌦️",
        53: "Moderate Drizzle 🌦️",
        55: "Dense Drizzle 🌧️",
        56: "Freezing Drizzle 🌧️",
        57: "Dense Freezing Drizzle 🌧️",
        61: "Slight Rain 🌧️",
        63: "Moderate Rain 🌧️",
        65: "Heavy Rain 🌧️",
        66: "Freezing Rain 🌧️",
        67: "Heavy Freezing Rain 🌧️",
        71: "Slight Snow ❄️",
        73: "Moderate Snow ❄️",
        75: "Heavy Snow ❄️",
        77: "Snow Grains ❄️",
        80: "Rain Showers 🌦️",
        81: "Moderate Rain Showers 🌧️",
        82: "Heavy Rain Showers ⛈️",
        85: "Snow Showers ❄️",
        86: "Heavy Snow Showers ❄️",
        95: "Thunderstorm ⛈️",
        96: "Thunderstorm with Hail ⛈️",
        99: "Heavy Thunderstorm with Hail ⛈️"
    };

    return conditions[code] || "Weather condition unavailable";
}

// Get city coordinates from Open-Meteo Geocoding API
async function getCityCoordinates(city) {
    const url = new URL(
        "https://geocoding-api.open-meteo.com/v1/search"
    );

    url.search = new URLSearchParams({
        name: city.trim(),
        count: "10",
        language: "en",
        format: "json"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to search for this city. Please try again."
        );
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
        throw new Error(
            "City not found. Please enter a valid city name."
        );
    }

    // Prefer an exact city-name match
    const searchCity = city.trim().toLowerCase();

    const exactCity = data.results.find(
        item => item.name.toLowerCase() === searchCity
    );

    return exactCity || data.results[0];
}

// Fetch current weather using city coordinates
async function getWeather(latitude, longitude) {
    const url = new URL(
        "https://api.open-meteo.com/v1/forecast"
    );

    url.search = new URLSearchParams({
        latitude: latitude,
        longitude: longitude,
        current:
            "temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m",
        timezone: "auto",
        wind_speed_unit: "kmh"
    });

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            "Unable to fetch weather data. Please try again."
        );
    }

    const data = await response.json();

    if (!data.current) {
        throw new Error(
            "Weather data is currently unavailable."
        );
    }

    return data;
}

// Display the weather on the dashboard
function displayWeather(city, data) {
    const current = data.current;

    cityName.textContent = city.country
        ? `${city.name}, ${city.country}`
        : city.name;

    weatherDescription.textContent =
        getWeatherDescription(current.weather_code);

    temperature.textContent =
        Math.round(current.temperature_2m);

    humidity.textContent =
        `${current.relative_humidity_2m}%`;

    windSpeed.textContent =
        `${current.wind_speed_10m} km/h`;

    feelsLike.textContent =
        `${Math.round(current.apparent_temperature)}°C`;

    updatedTime.textContent =
        `Weather observation time: ${current.time.replace("T", " ")} (local city time)`;

    weatherResult.hidden = false;
    message.textContent = "Weather updated successfully!";
}

// Search and display weather for the entered city
weatherForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        message.textContent = "Please enter a city name.";
        weatherResult.hidden = true;
        return;
    }

    searchButton.disabled = true;
    message.textContent = "Loading weather data...";
    weatherResult.hidden = true;

    try {
        const cityData = await getCityCoordinates(city);

        const weatherData = await getWeather(
            cityData.latitude,
            cityData.longitude
        );

        displayWeather(cityData, weatherData);

    } catch (error) {
        console.error("Weather Error:", error);

        if (error instanceof TypeError) {
            message.textContent =
                "Network error. Check your internet connection and try again.";
        } else {
            message.textContent = error.message;
        }

        weatherResult.hidden = true;

    } finally {
        searchButton.disabled = false;
    }
});
