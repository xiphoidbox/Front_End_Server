let currentUnit = 'F';
let map;
let weatherData;
let forecastData;
let originalWeatherData;
let originalForecastData;
let filteredForecasts; 
let forecastFahrenheit = [];
let forecastCelsius = []; 

function convertTemperatureToFahrenheit(temp) {
    return parseFloat(temp);
}

function convertTemperatureToCelsius(temp) {
    temp = parseFloat(temp);
    const tempCelsius = (temp - 32) * 5 / 9;
    return parseFloat(tempCelsius.toFixed(1));
}

async function fetchApiKey() {
    console.log('Requesting API key');
    try {
        const response = await fetch('https://proxy.alejandrobermea.com:3000/api-key');
        console.log('Received response from server, status:', response.status);
        if (!response.ok) {
            throw new Error('Failed to fetch API key, status: ' + response.status);
        }
        const data = await response.json();
        console.log('API Key:', data.apiKey);
        return data.apiKey;
    } catch (error) {
        console.error('Error:', error);
        alert(`Error fetching API key: ${error.message}`);
    }
}

async function fetchWeatherAndForecast(lat, lon) {
    try {
        const apiKey = await fetchApiKey();
        if (!apiKey) {
            throw new Error('API key not available');
        }

        const units = 'imperial'; 
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=${units}`;
        console.log(`Fetching weather and forecast with URL: ${url}`);

        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log('Raw weather and forecast data:', data);

        forecastData = data;
        originalForecastData = JSON.parse(JSON.stringify(forecastData));

        weatherData = forecastData.list[0];
        originalWeatherData = JSON.parse(JSON.stringify(weatherData));

        filteredForecasts = filterDailyForecasts(forecastData.list);
        forecastFahrenheit = createForecastList(filteredForecasts.slice(1, 6), true);
        forecastCelsius = createForecastList(filteredForecasts.slice(1, 6), false);

        console.log('Processed weather and 5-day forecast data:', forecastData);

        displayCurrentWeather(weatherData);
        displayForecastWeather(forecastFahrenheit);
    } catch (error) {
        console.error('Error:', error);
        alert(`Error fetching weather data: ${error.message}`);
    }
}

function initMap(lat, lon) {
    if (!map) { 
        map = L.map('temperatureMap').setView([lat, lon], 10);
        L.tileLayer(`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`, {
            maxZoom: 19
        }).addTo(map);

        const apiKey = '27f8b1bae5438101283892a20d157196'; 
        L.tileLayer(`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${apiKey}`, {
            attribution: '&copy; <a href="https://www.openweathermap.org">OpenWeatherMap</a>',
            maxZoom: 19
        }).addTo(map);
    } else {
        map.setView([lat, lon], 10); 
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
        weatherDiv.style.display = 'block';
    }
    initMap(forecastData.city.coord.lat, forecastData.city.coord.lon);
}

function displayForecastWeather(forecasts) {
    console.log('Displaying 5-day forecast data:', forecasts);
    const forecastDiv = document.getElementById('forecastWeather');
    if (forecastDiv) {
        forecastDiv.innerHTML = '<h2>Following 5-day forecast</h2>';

        forecasts.forEach(item => {
            const tempMax = parseFloat(item.temp_max);
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
    return filtered.slice(0, 6);
}

function createForecastList(forecasts, isFahrenheit) {
    return forecasts.map(forecast => ({
        date: forecast.dt,
        temp_max: isFahrenheit ? forecast.main.temp_max : convertTemperatureToCelsius(forecast.main.temp_max),
        temp_min: isFahrenheit ? forecast.main.temp_min : convertTemperatureToCelsius(forecast.main.temp_min),
        description: forecast.weather[0].description
    }));
}

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
    sliderText.textContent = 'Fahrenheit';

    if (unitToggle) {
        unitToggle.checked = false;
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
document.addEventListener('mousemove', function(e) {
    var gradientBar = document.querySelector('.static_gradient-bar');
    var width = window.innerWidth;
    var mouseX = e.clientX;
    var percentage = mouseX / width * 100;
    gradientBar.style.background = 'linear-gradient(to right, black 0%, black ' + (percentage - 20) + '%, #202a2d ' + percentage + '%, black ' + (percentage + 20) + '%, black 100%)';
});
