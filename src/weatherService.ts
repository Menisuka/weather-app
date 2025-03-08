import axios from 'axios';

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// Using interface to maintain type safety
export interface WeatherData {
  name: string; // City name
  sys: {
    country: string; // Country code
    sunrise: number; // Sunrise time
    sunset: number; // Sunset time
  };
  main: {
    temp: number; // Temperature in Kelvin
    humidity: number; // Humidity in %
    pressure: number; // Pressure in hPa
  };
  wind: {
    speed: number; // Wind speed in m/s
  };
  weather: {
    description: string; // Weather description
    icon: string; // Weather icon code
  }[];
}

export const fetchWeather = async (query: string): Promise<WeatherData> => {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        q: query,
        appid: API_KEY,
        units: 'metric',
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};