import axios from "axios";
import {
  FaSun,
  FaSnowflake,
  FaCloudRain,
  FaCloud,
  FaSmog,
  FaBolt,
} from "react-icons/fa";

interface WeatherData {
  current_weather: {
    temperature: number;
    weathercode: number;
  };
}

export const fetchWeather = async (
  latitude?: number,
  longitude?: number
): Promise<WeatherData> => {
  return new Promise((resolve, reject) => {
    const fetchWeatherData = async (lat: number, lon: number) => {
      try {
        const res = await axios.get<WeatherData>(
          `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`
        );
        resolve(res.data);
      } catch (error: unknown) {
        if (error instanceof Error) {
          reject(new Error(error.message));
        } else {
          reject(new Error("An unknown error occurred."));
        }
      }
    };

    if (latitude !== undefined && longitude !== undefined) {
      fetchWeatherData(latitude, longitude);
    } else {
      if (!navigator.geolocation) {
        throw new Error("Geolocation is not supported by this browser.");
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          reject(new Error(error.message) || "An unknown error occurred.");
        }
      );
    }
  });
};

export const WeatherIcon = ({ weathercode }: { weathercode: number }) => {
  const icons = {
    Sunny: <FaSun className="ml-2 text-yellow-500" />,
    Cloudy: <FaCloud className="ml-2 text-gray-400" />,
    Raining: <FaCloudRain className="ml-2 text-gray-500" />,
    Snowing: <FaSnowflake className="ml-2 text-blue-500" />,
    Foggy: <FaSmog className="ml-2 text-gray-300" />,
    Thunderstorm: <FaBolt className="ml-2 text-yellow-600" />,
  };

  if (weathercode === 0) return icons.Sunny;
  if (weathercode >= 1 && weathercode <= 3) return icons.Cloudy;
  if (weathercode >= 45 && weathercode <= 48) return icons.Foggy;
  if (weathercode >= 51 && weathercode <= 67) return icons.Raining;
  if (weathercode >= 71 && weathercode <= 77) return icons.Snowing;
  if (weathercode >= 95 && weathercode <= 99) return icons.Thunderstorm;
  return null;
};
