const form = document.getElementById("weather-form");
const input = document.getElementById("city-input");
const suggestionsUL = document.getElementById("suggestions");
const useLocBtn = document.getElementById("use-location");
const icon = document.querySelector(".icon");
const temp = document.querySelector(".temp");
const desc = document.querySelector(".desc");
const details = document.querySelector(".details");
const weekly = document.querySelector(".weekly");
const hourly = document.querySelector(".hourly");
const sound = document.getElementById("sound");
const themeToggle = document.getElementById("theme-toggle");
const unitToggle = document.getElementById("unit-toggle");
const unitLabel = document.getElementById("unit-label");
const loader = document.getElementById("loader");
const weatherData = document.getElementById("weather-data");

const cities = ["London", "New York", "Paris", "Tokyo", "Delhi", "Mumbai", "Sydney", "Berlin", "Toronto", "Dubai"];
let isCelsius = true;
let lastWeatherData = null;

// Enhanced graphical weather icons as SVG strings
const weatherIcons = {
  0: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sunGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFD700;stop-opacity:1"/><stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.8"/></radialGradient></defs><circle cx="60" cy="60" r="30" fill="url(#sunGrad)" /><path d="M60 20V10M60 110V100M100 60H110M10 60H20M90 30L96.5 23.5M23.5 96.5L30 90M90 90L96.5 96.5M23.5 23.5L30 30" stroke="#FFA500" stroke-width="5" stroke-linecap="round"/></svg>`, // Clear sky
  1: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="sunGrad" cx="50%" cy="50%" r="50%"><stop offset="0%" style="stop-color:#FFD700;stop-opacity:1"/><stop offset="100%" style="stop-color:#FFA500;stop-opacity:0.8"/></radialGradient></defs><circle cx="60" cy="50" r="20" fill="url(#sunGrad)"/><path d="M30 70Q40 60 50 70T70 80T90 70" fill="#D3D3D3" stroke="#A9A9A9" stroke-width="2"/><path d="M80 50H90M70 40L75 35M85 65L90 70" stroke="#FFA500" stroke-width="4" stroke-linecap="round"/></svg>`, // Mainly clear
  2: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M20 70Q30 60 40 70T60 80T80 70Q90 60 100 70" fill="#D3D3D3" stroke="#A9A9A9" stroke-width="2"/><path d="M30 50Q40 40 50 50T70 60Q80 50 90 60" fill="#B0C4DE" stroke="#A9A9A9" stroke-width="2"/></svg>`, // Partly cloudy
  3: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M20 80Q30 70 40 80T60 90Q70 80 80 90" fill="#778899" stroke="#A9A9A9" stroke-width="2"/></svg>`, // Overcast
  45: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="40" width="100" height="40" fill="#E0E0E0" fill-opacity="0.5" stroke="#D3D3D3" stroke-width="2"/><rect x="20" y="50" width="80" height="20" fill="#D3D3D3" fill-opacity="0.6" stroke="#D3D3D3" stroke-width="2"/></svg>`, // Fog
  48: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><rect x="10" y="40" width="100" height="40" fill="#D3D3D3" fill-opacity="0.6" stroke="#A9A9A9" stroke-width="2"/><rect x="20" y="50" width="80" height="20" fill="#E0E0E0" fill-opacity="0.5" stroke="#A9A9A9" stroke-width="2"/></svg>`, // Rime fog
  51: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M40 80H42M50 80H52M60 80H62M70 80H72" stroke="#4682B4" stroke-width="3" stroke-linecap="round"/></svg>`, // Drizzle
  61: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M40 80L38 90M50 80L48 90M60 80L58 90M70 80L68 90" stroke="#4682B4" stroke-width="5" stroke-linecap="round"/></svg>`, // Rain
  71: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M40 80Q41 82 40 84T41 86T40 88T41 90" fill="#FFF"/><path d="M50 80Q51 82 50 84T51 86T50 88T51 90" fill="#FFF"/><path d="M60 80Q61 82 60 84T61 86T60 88T61 90" fill="#FFF"/></svg>`, // Snow
  80: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M40 80L38 90M50 80L48 90" stroke="#4682B4" stroke-width="5" stroke-linecap="round"/></svg>`, // Rain showers
  95: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><path d="M40 80L36 90L44 86" stroke="#FFD700" stroke-width="5" stroke-linecap="round"/><path d="M50 80L46 90L54 86" stroke="#FFD700" stroke-width="5" stroke-linecap="round"/></svg>`, // Thunderstorm
  99: `<svg width="120" height="120" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg"><path d="M10 60Q20 50 30 60T50 70T70 60Q80 50 90 60T110 70" fill="#A9A9A9" stroke="#778899" stroke-width="3"/><circle cx="40" cy="85" r="4" fill="#B0C4DE"/><circle cx="50" cy="85" r="4" fill="#B0C4DE"/><circle cx="60" cy="85" r="4" fill="#B0C4DE"/></svg>` // Hailstorm
};

// Theme toggle
themeToggle.addEventListener("change", () => {
  document.body.className = themeToggle.checked ? "dark" : "light";
});

// Unit toggle
unitToggle.addEventListener("change", () => {
  isCelsius = !unitToggle.checked;
  unitLabel.textContent = isCelsius ? "°C" : "°F";
  if (lastWeatherData) {
    displayWeather(lastWeatherData);
  }
});

// Autocomplete
input.addEventListener("input", () => {
  const val = input.value.toLowerCase();
  suggestionsUL.innerHTML = cities
    .filter(c => c.toLowerCase().startsWith(val))
    .map(c => `<li>${c}</li>`).join("");
});
suggestionsUL.addEventListener("click", e => {
  if (e.target.tagName === "LI") {
    input.value = e.target.textContent;
    suggestionsUL.innerHTML = "";
  }
});

// Submit or geolocation
form.addEventListener("submit", e => {
  e.preventDefault();
  searchCity(input.value);
});
useLocBtn.addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    p => fetchWeather(p.coords.latitude, p.coords.longitude),
    () => {
      desc.textContent = "Geolocation access denied.";
      loader.style.display = "none";
    }
  );
});

// Convert name → coords
async function searchCity(name) {
  loader.style.display = "block";
  weatherData.style.display = "none";
  try {
    const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${name}&count=1`);
    const dt = await res.json();
    if (!dt.results) {
      desc.textContent = "City not found.";
      loader.style.display = "none";
      return;
    }
    const { latitude, longitude } = dt.results[0];
    fetchWeather(latitude, longitude);
  } catch (error) {
    desc.textContent = "Error fetching city data.";
    loader.style.display = "none";
  }
}

// Fetch weather data
async function fetchWeather(lat, lon) {
  loader.style.display = "block";
  weatherData.style.display = "none";
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}`
      + `&current_weather=true&hourly=temperature_2m,weathercode`
      + `&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
    const r = await fetch(url);
    const data = await r.json();
    lastWeatherData = data;
    displayWeather(data);
    sound.play();
  } catch (error) {
    desc.textContent = "Error fetching weather data.";
  } finally {
    loader.style.display = "none";
    weatherData.style.display = "block";
  }
}

// Display weather data
function displayWeather(data) {
  const cw = data.current_weather;
  const tempValue = isCelsius ? cw.temperature : (cw.temperature * 9/5) + 32;
  icon.innerHTML = weatherIcons[cw.weathercode] || weatherIcons[0];
  temp.textContent = `${Math.round(tempValue)}${isCelsius ? '°C' : '°F'}`;
  desc.textContent = codeToDesc(cw.weathercode);
  updateBackground(cw.weathercode);

  details.innerHTML = [
    `Wind: ${cw.windspeed} km/h`,
    `Time: ${new Date(cw.time).toLocaleTimeString()}`
  ].map(d => `<div>${d}</div>`).join("");

  weekly.innerHTML = data.daily.time.map((d, i) => {
    const maxTemp = isCelsius ? data.daily.temperature_2m_max[i] : (data.daily.temperature_2m_max[i] * 9/5) + 32;
    const minTemp = isCelsius ? data.daily.temperature_2m_min[i] : (data.daily.temperature_2m_min[i] * 9/5) + 32;
    return `
      <div>
        <strong>${new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</strong><br/>
        ${Math.round(maxTemp)}° / ${Math.round(minTemp)}°${isCelsius ? 'C' : 'F'}<br/>
        ${weatherIcons[data.daily.weathercode[i]] || weatherIcons[0]}
      </div>`;
  }).join("");

  hourly.innerHTML = data.hourly.time.slice(0, 12).map((t, i) => {
    const hourlyTemp = isCelsius ? data.hourly.temperature_2m[i] : (data.hourly.temperature_2m[i] * 9/5) + 32;
    return `
      <div>
        <strong>${new Date(t).getHours()}:00</strong><br/>
        ${Math.round(hourlyTemp)}°${isCelsius ? 'C' : 'F'}<br/>
        ${weatherIcons[data.hourly.weathercode[i]] || weatherIcons[0]}
      </div>`;
  }).join("");
}

// Weather code descriptions
function codeToDesc(c) {
  const m = {
    0: 'Clear sky', 1: 'Mainly clear', 2: 'Partly cloudy',
    3: 'Overcast', 45: 'Fog', 48: 'Depositing rime fog',
    51: 'Light drizzle', 61: 'Rain', 71: 'Snow',
    80: 'Rain showers', 95: 'Thunderstorm', 99: 'Hailstorm'
  };
  return m[c] || `Weather code ${c}`;
}

// Dynamic sky-related background
function updateBackground(code) {
  const backgrounds = {
    0: 'linear-gradient(135deg, #87CEEB, #1E90FF)', // Clear sky: Bright blue
    1: 'linear-gradient(135deg, #B0E0E6, #4682B4)', // Mainly clear: Light blue
    2: 'linear-gradient(135deg, #B0C4DE, #708090)', // Partly cloudy: Blue-gray
    3: 'linear-gradient(135deg, #778899, #4B5EAA)', // Overcast: Dark gray-blue
    45: 'linear-gradient(135deg, #D3D3D3, #A9A9A9)', // Fog: Hazy gray
    48: 'linear-gradient(135deg, #D3D3D3, #A9A9A9)', // Rime fog: Hazy gray
    51: 'linear-gradient(135deg, #78909C, #2F4F4F)', // Drizzle: Grayish-blue
    61: 'linear-gradient(135deg, #4682B4, #2F4F4F)', // Rain: Dark blue
    71: 'linear-gradient(135deg, #E6E6FA, #B0C4DE)', // Snow: Frosty light gray
    80: 'linear-gradient(135deg, #5F9EA0, #2F4F4F)', // Rain showers: Teal-blue
    95: 'linear-gradient(135deg, #483D8B, #2F4F4F)', // Thunderstorm: Dark stormy
    99: 'linear-gradient(135deg, #6A5ACD, #2F4F4F)'  // Hailstorm: Purple-gray
  };
  const darkBackgrounds = {
    0: 'linear-gradient(135deg, #4682B4, #191970)', // Clear sky: Night blue
    1: 'linear-gradient(135deg, #5F9EA0, #2F4F4F)', // Mainly clear: Darker blue
    2: 'linear-gradient(135deg, #708090, #2F4F4F)', // Partly cloudy: Dark gray-blue
    3: 'linear-gradient(135deg, #4B5EAA, #2F4F4F)', // Overcast: Darker gray-blue
    45: 'linear-gradient(135deg, #A9A9A9, #696969)', // Fog: Dark hazy gray
    48: 'linear-gradient(135deg, #A9A9A9, #696969)', // Rime fog: Dark hazy gray
    51: 'linear-gradient(135deg, #2F4F4F, #1C2526)', // Drizzle: Dark gray
    61: 'linear-gradient(135deg, #2F4F4F, #1C2526)', // Rain: Dark stormy
    71: 'linear-gradient(135deg, #B0C4DE, #778899)', // Snow: Dark frosty gray
    80: 'linear-gradient(135deg, #2F4F4F, #1C2526)', // Rain showers: Dark teal
    95: 'linear-gradient(135deg, #2F4F4F, #191970)', // Thunderstorm: Dark stormy
    99: 'linear-gradient(135deg, #483D8B, #191970)'  // Hailstorm: Dark purple
  };
  document.body.style.background = themeToggle.checked ? darkBackgrounds[code] || darkBackgrounds[0] : backgrounds[code] || backgrounds[0];
}