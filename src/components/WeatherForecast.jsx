import { CloudSnow, CloudRain, Sun, CloudFog } from 'lucide-react';

function WeatherIcon({ main }) {
  const label = String(main || '').toLowerCase();
  if (label.includes('rain') || label.includes('drizzle')) return <CloudRain size={24} />;
  if (label.includes('snow')) return <CloudSnow size={24} />;
  if (label.includes('cloud')) return <CloudFog size={24} />;
  return <Sun size={24} />;
}

function formatDate(timestamp) {
  return new Date(timestamp * 1000).toLocaleDateString('id-ID', {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  });
}

export default function WeatherForecast({ forecast }) {
  const dailyList = forecast.list.filter((item) => item.dt_txt.includes('12:00:00')).slice(0, 5);

  return (
    <div className="forecast-grid">
      {dailyList.map((item) => (
        <article key={item.dt} className="forecast-card">
          <p className="forecast-day">{formatDate(item.dt)}</p>
          <WeatherIcon main={item.weather?.[0]?.main} />
          <p className="forecast-desc capitalize">{item.weather?.[0]?.description}</p>
          <div className="forecast-values">
            <span>{Math.round(item.main.temp)}°C</span>
            <span>{Math.round(item.main.temp_min)}° / {Math.round(item.main.temp_max)}°</span>
          </div>
        </article>
      ))}
    </div>
  );
}
