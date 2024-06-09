let currentUnit = 'F';  // Default unit to Fahrenheit
let map;  // Declare the map variable globally
let weatherData;  // Variable to store weather data
let forecastData;  // Variable to store forecast data
let originalWeatherData;  // Variable to store original weather data
let originalForecastData;  // Variable to store original forecast data
let filteredForecasts; // Store the initial filtered forecasts
let forecastFahrenheit = [];  // List to store forecast data in Fahrenheit
let forecastCelsius = [];  // List to store forecast data in Celsius

// Convert temperature from Fahrenheit to Celsius
function convertTemperatureToFahrenheit(temp) {
    return parseFloat(temp);
}

function convertTemperatureToCelsius(temp) {
    temp = parseFloat(temp);  // Ensure temp is a number
    const tempCelsius = (temp - 32) * 5 / 9;
    return parseFloat(tempCelsius.toFixed(1));
}

// Fetch the weather and 5-day forecast data
async function fetchWeatherAndForecast(lat, lon) {
    const apiKey = '272f1aa467ad472f5dff195011dc92eb';  // Replace with your actual API key
    const units = 'imperial';  // Always fetch data in Fahrenheit
    const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
    console.log(`Fetching weather and forecast with URL: ${url}`);

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Raw weather and forecast data:', data);
        
        forecastData = data;
        originalForecastData = JSON.parse(JSON.stringify(forecastData));  // Store the original data

        weatherData = forecastData.list[0];  // Use the first item for current weather
        originalWeatherData = JSON.parse(JSON.stringify(weatherData));  // Store the original data

        filteredForecasts = filterDailyForecasts(forecastData.list); // Store the initial filtered forecasts
        forecastFahrenheit = createForecastList(filteredForecasts.slice(1, 6), true); // Indices 1-5
        forecastCelsius = createForecastList(filteredForecasts.slice(1, 6), false); // Indices 1-5

        console.log('Processed weather and 5-day forecast data:', forecastData);

        displayCurrentWeather(weatherData);
        displayForecastWeather(forecastFahrenheit);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error fetching weather data: ${error.message}`);
    }
}

// Initialize the Leaflet map
function initMap(lat, lon) {
    if (!map) {  // Check if the map is already initialized
        map = L.map('temperatureMap').setView([lat, lon], 10);
        L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19
        }).addTo(map);

        const apiKey = '272f1aa467ad472f5dff195011dc92eb';  // Replace with your actual API key
        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org">OpenWeatherMap</a>',
            maxZoom: 19
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10);  // Update the map view if already initialized
    }
}

function displayCurrentWeather(data) {
    console.log('Displaying current weather data:', data);
    const weatherDiv = document.getElementById('currentWeather');
    if (weatherDiv) {
        const temperature = parseFloat(data.main.temp);
        const feelsLike = parseFloat(data.main.feels_like);

        weatherDiv.innerHTML = `
            <h2>Current Conditions for ${forecastData.city.name}</h2>
            <div class="weather-details">
                <p>Temperature: ${temperature.toFixed(1)}°${currentUnit}</p>
                <p>Feels like: ${feelsLike.toFixed(1)}°${currentUnit}</p>
                <p>Weather: ${data.weather[0].description}</p>
            </div>
        `;
        weatherDiv.style.display = 'block'; // Show the weather section
    }
    initMap(forecastData.city.coord.lat, forecastData.city.coord.lon);
}

// Display the 5-day forecast data
function displayForecastWeather(forecasts) {
    console.log('Displaying 5-day forecast data:', forecasts);
    const forecastDiv = document.getElementById('forecastWeather');
    if (forecastDiv) {
        forecastDiv.innerHTML = '<h2>Following 5-day forecast</h2>';

        forecasts.forEach(item => {
            const tempMax = parseFloat(item.temp_max);  // Ensure tempMax is a number
            let forecastDate = new Date(item.date * 1000);
            let formattedDate = forecastDate.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' });

            forecastDiv.innerHTML += `
                <div class="forecast-item">
                    <span class="weather-description">${item.description}</span>
                    <span class="temperature">${tempMax.toFixed(1)}°${currentUnit}</span>
                    <span class="date">${formattedDate}</span>
                </div>
            `;
        });
    }
}

// Filter daily forecasts, selecting one forecast per day
function filterDailyForecasts(forecasts) {
    const filtered = [];
    const dates = new Set();

    forecasts.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const dateString = date.toLocaleDateString();
        
        if (!dates.has(dateString)) {
            dates.add(dateString);
            filtered.push(forecast);
        }
    });

    // Ensure only 6 days are included (current day + 5-day forecast)
    return filtered.slice(0, 6);
}

// Create a forecast list in the specified temperature unit
function createForecastList(forecasts, isFahrenheit) {
    return forecasts.map(forecast => ({
        date: forecast.dt,
        temp_max: isFahrenheit ? forecast.main.temp_max : convertTemperatureToCelsius(forecast.main.temp_max),
        temp_min: isFahrenheit ? forecast.main.temp_min : convertTemperatureToCelsius(forecast.main.temp_min),
        description: forecast.weather[0].description
    }));
}

// Convert temperatures and update the displayed data
function updateTemperatureUnits() {
    if (originalWeatherData && filteredForecasts) {
        console.log('Updating temperatures to', currentUnit);
        if (currentUnit === 'C') {
            weatherData.main.temp = convertTemperatureToCelsius(originalWeatherData.main.temp);
            weatherData.main.feels_like = convertTemperatureToCelsius(originalWeatherData.main.feels_like);

            displayForecastWeather(forecastCelsius);
        } else {
            weatherData.main.temp = convertTemperatureToFahrenheit(originalWeatherData.main.temp);
            weatherData.main.feels_like = convertTemperatureToFahrenheit(originalWeatherData.main.feels_like);

            displayForecastWeather(forecastFahrenheit);
        }

        displayCurrentWeather(weatherData);
        printTemperatures();
    }
}

// Print the current temperatures
function printTemperatures() {
    console.log(`Current Weather: ${weatherData.main.temp}°${currentUnit}, Feels like: ${weatherData.main.feels_like}°${currentUnit}`);
    console.log('5-Day Forecast:');
    (currentUnit === 'C' ? forecastCelsius : forecastFahrenheit).forEach(item => {
        console.log(`Date: ${new Date(item.date * 1000).toLocaleDateString()}, Max Temp: ${item.temp_max}°${currentUnit}, Min Temp: ${item.temp_min}°${currentUnit}`);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const unitToggle = document.getElementById('unitToggle');
    const sliderText = document.querySelector('.slider-text');
    sliderText.textContent = 'Fahrenheit'; // Set initial text to Fahrenheit

    if (unitToggle) {
        unitToggle.checked = false; // Start with toggle switched to Fahrenheit
        unitToggle.addEventListener('change', () => {
            currentUnit = unitToggle.checked ? 'C' : 'F';
            sliderText.textContent = currentUnit === 'C' ? 'Celsius' : 'Fahrenheit';
            sliderText.style.left = currentUnit === 'C' ? 'calc(100% - 85px)' : '20px';
            updateTemperatureUnits();
        });
    }

    getLocationAndWeather();
});

function getLocationAndWeather() {
    if (navigator.geolocation) {
        console.log('Attempting to retrieve location...');
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            console.log(`Location obtained: Latitude ${lat}, Longitude ${lon}`);
            fetchWeatherAndForecast(lat, lon);
        }, () => {
            alert('Unable to retrieve your location');
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}
