import { useState } from "react";

export default function App() {
  const [city, setCity] = useState("");
  const [temp, setTemp] = useState("");
  const [wind, setWind] = useState("");

  const [searchCity, setSearchCity] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  // ✅ Render backend base URL
  const API_BASE = "https://weather-app-react-express-mongodb.onrender.com/api/weather";

  // ✅ Save weather to MongoDB
  const saveWeather = async () => {
    if (!city || !temp || !wind) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          city,
          temperature: Number(temp),
          windspeed: Number(wind),
        }),
      });

      if (res.ok) {
        alert("✅ Weather saved successfully!");
        setCity("");
        setTemp("");
        setWind("");
      } else {
        alert("⚠️ Error saving weather.");
      }
    } catch (error) {
      console.error(error);
      alert("❌ Unable to connect to server.");
    }
  };

  // ✅ Search weather by city
  const searchWeather = async () => {
    if (!searchCity) return;

    try {
      const res = await fetch(`${API_BASE}/${searchCity}`);

      if (!res.ok) {
        setErrorMsg("❌ City not found in database.");
        setSearchResult(null);
        return;
      }

      const data = await res.json();
      setSearchResult(data);
      setErrorMsg("");
    } catch (err) {
      console.error(err);
      setErrorMsg("⚠️ Error fetching weather data.");
      setSearchResult(null);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "#020617",
        color: "white",
        padding: "32px",
        boxSizing: "border-box",
        fontFamily:
          'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <h1
        style={{
          fontSize: "40px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Weather App with MongoDB
      </h1>

      {/* Add / Update Weather Section */}
      <h2 style={{ marginTop: "20px" }}>Add / Update Weather</h2>

      <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
        <input
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Temperature (°C)"
          value={temp}
          onChange={(e) => setTemp(e.target.value)}
          style={inputStyle}
        />
        <input
          placeholder="Wind Speed (m/s)"
          value={wind}
          onChange={(e) => setWind(e.target.value)}
          style={inputStyle}
        />
        <button style={buttonStyle} onClick={saveWeather}>
          Save Weather
        </button>
      </div>

      {/* Search Weather Section */}
      <h2 style={{ marginTop: "40px" }}>Search Weather by City</h2>

      <div style={{ display: "flex", gap: "12px", marginTop: "15px" }}>
        <input
          placeholder="Enter city"
          value={searchCity}
          onChange={(e) => setSearchCity(e.target.value)}
          style={inputStyle}
        />
        <button style={buttonStyleGreen} onClick={searchWeather}>
          Get Weather
        </button>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <p style={{ color: "red", marginTop: "10px", fontSize: "18px" }}>
          {errorMsg}
        </p>
      )}

      {/* Search Result */}
      {searchResult && (
        <div
          style={{
            marginTop: "25px",
            fontSize: "22px",
            background: "#0f172a",
            padding: "20px",
            borderRadius: "8px",
            width: "fit-content",
          }}
        >
          <strong>{searchResult.city}</strong> | Temp:{" "}
          {searchResult.temperature}°C | Wind: {searchResult.windspeed} m/s
        </div>
      )}
    </div>
  );
}

/* 🌈 Reusable styles */
const inputStyle = {
  padding: "10px",
  borderRadius: "6px",
  border: "1px solid #555",
  background: "#0f172a",
  color: "white",
  width: "180px",
};

const buttonStyle = {
  background: "#1e293b",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};

const buttonStyleGreen = {
  background: "#22c55e",
  color: "white",
  padding: "10px 18px",
  borderRadius: "6px",
  border: "none",
  cursor: "pointer",
};
