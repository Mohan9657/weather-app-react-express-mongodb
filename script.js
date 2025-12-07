const cityInput = document.getElementById("cityInput");
const searchBtn = document.getElementById("searchBtn");
const resultDiv = document.getElementById("result");

// Temporary random test data
const dummyWeatherData = {
  name: "Hyderabad",
  sys: { country: "IN" },
  main: {
    temp: 305.15,          // Kelvin
    feels_like: 308.15,
    humidity: 60
  },
  weather: [
    { description: "Partly cloudy" }
  ],
  wind: {
    speed: 4.2
  }
};

// Convert Kelvin to Celsius
function toCelsius(kelvin) {
  return (kelvin - 273.15).toFixed(1);
}

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();

  if (!city) {
    resultDiv.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  // Instead of API call, use dummy data for now
  showWeather(dummyWeatherData);
});

function showWeather(data) {
  const cityName = data.name;
  const country = data.sys.country;
  const temp = toCelsius(data.main.temp);
  const feelsLike = toCelsius(data.main.feels_like);
  const desc = data.weather[0].description;
  const humidity = data.main.humidity;
  const wind = data.wind.speed;

  resultDiv.innerHTML = `
    <h3>${cityName}, ${country}</h3>
    <p><strong>${temp}°C</strong> (feels like ${feelsLike}°C)</p>
    <p>${desc.toUpperCase()}</p>
    <p>Humidity: ${humidity}%</p>
    <p>Wind: ${wind} m/s</p>
  `;
}
