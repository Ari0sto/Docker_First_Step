import { useEffect, useState } from 'react';
import './App.css';

// Описание структуры данных, которую ждем от бекенда
interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

function App() {
  const [forecasts, setForecasts] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // ВАЖНО: порт Swagger!
    fetch('https://localhost:7073/WeatherForecast')
      .then((response) => response.json())
      .then((data) => {
        setForecasts(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Помилка при завантаженні даних:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className="card">
      <h1>☁️ Прогноз погоди</h1>
      
      {loading ? (
        <p>Завантаження даних з сервера...</p>
      ) : (
        <table border={1} cellPadding={10} style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th>Дата</th>
              <th>Температура (°C)</th>
              <th>Температура (°F)</th>
              <th>Опис</th>
            </tr>
          </thead>
          <tbody>
            {forecasts.map((forecast, index) => (
              <tr key={index}>
                <td>{new Date(forecast.date).toLocaleDateString('uk-UA')}</td>
                <td>{forecast.temperatureC}°C</td>
                <td>{forecast.temperatureF}°F</td>
                <td>{forecast.summary}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;