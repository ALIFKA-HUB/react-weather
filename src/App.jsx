import { useEffect, useState } from 'react';
import { Search, Thermometer, Droplet, Wind, AlertTriangle, CloudRain, SunMedium } from 'lucide-react';
import WeatherForecast from './components/WeatherForecast.jsx';

const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const DEFAULT_LOCATION = 'Mount Semeru';

const warningPattern = /rain|storm|thunder|drizzle|snow|hurricane|sleet/i;

function App() {
  const [query, setQuery] = useState(DEFAULT_LOCATION);
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWeather(DEFAULT_LOCATION);
  }, []);

  async function fetchWeather(location) {
    if (!API_KEY) {
      setError('API key tidak ditemukan. Tambahkan VITE_OPENWEATHER_API_KEY pada file .env');
      return;
    }

    setLoading(true);
    setError('');
    setWeather(null);
    setForecast(null);

    try {
      const currentRes = await fetch(
        `${BASE_URL}/weather?q=${encodeURIComponent(location)}&units=metric&lang=id&appid=${API_KEY}`
      );

      if (!currentRes.ok) {
        throw new Error('Lokasi tidak ditemukan. Coba nama gunung atau kota lain.');
      }

      const currentData = await currentRes.json();

      const forecastRes = await fetch(
        `${BASE_URL}/forecast?q=${encodeURIComponent(location)}&units=metric&lang=id&appid=${API_KEY}`
      );

      if (!forecastRes.ok) {
        throw new Error('Gagal mengambil data prakiraan cuaca.');
      }

      const forecastData = await forecastRes.json();
      setWeather(currentData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat mengambil data cuaca.');
    } finally {
      setLoading(false);
    }
  }

  const description = weather?.weather?.[0]?.description || 'Tidak tersedia';
  const hasWarning = warningPattern.test(description) ||
    forecast?.list?.some((item) => warningPattern.test(item.weather[0]?.description));

  return (
    <div className="app-shell">
      <header className="hero-panel">
        <div className="hero-title">
          <SunMedium size={32} />
          <div>
            <h1>Dasbor Cuaca Pegunungan</h1>
            <p>Search gunung atau lokasi untuk melihat cuaca real-time.</p>
          </div>
        </div>
      </header>

      <section className="search-panel">
        <form onSubmit={(event) => { event.preventDefault(); fetchWeather(query.trim()); }}>
          <label htmlFor="location">Cari lokasi atau gunung</label>
          <div className="input-group">
            <input
              id="location"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Contoh: Mount Gede"
            />
            <button type="submit" className="btn-primary">
              <Search size={18} /> Cari
            </button>
          </div>
        </form>
      </section>

      {error && (
        <div className="alert-banner">
          <AlertTriangle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="loading-panel">
          <div className="spinner" />
        </div>
      ) : weather ? (
        <main className="weather-grid">
          <article className={`weather-card ${hasWarning ? 'warning' : 'normal'}`}>
            <div className="weather-head">
              <p className="subtitle">{weather.name}, {weather.sys?.country}</p>
              <h2>{weather.weather?.[0]?.main}</h2>
              <p className="description">{description}</p>
            </div>

            <div className="weather-summary">
              <div className="weather-value">
                <Thermometer size={18} />
                <div>
                  <span className="label">Suhu</span>
                  <strong>{Math.round(weather.main.temp)}°C</strong>
                </div>
              </div>
              <div className="weather-value">
                <Droplet size={18} />
                <div>
                  <span className="label">Kelembapan</span>
                  <strong>{weather.main.humidity}%</strong>
                </div>
              </div>
              <div className="weather-value">
                <Wind size={18} />
                <div>
                  <span className="label">Angin</span>
                  <strong>{weather.wind.speed} m/s</strong>
                </div>
              </div>
            </div>

            <div className="extra-panel">
              <span>Terasa seperti</span>
              <strong>{Math.round(weather.main.feels_like)}°C</strong>
            </div>

            {hasWarning && (
              <div className="alert-banner warning-banner">
                <CloudRain size={18} />
                <span>Prakiraan badai/hujan lebat terdeteksi. Hati-hati!</span>
              </div>
            )}
          </article>

          <section className="forecast-panel">
            <h3>Prakiraan 5 Hari</h3>
            {forecast ? <WeatherForecast forecast={forecast} /> : <p>Memuat prakiraan...</p>}
          </section>
        </main>
      ) : null}
    </div>
  );
}

export default App;
