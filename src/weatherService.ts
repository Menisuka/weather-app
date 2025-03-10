import axios from "axios";
// import { setupCache } from "axios-cache-interceptor";

//Create a cashed axios
// const cachedAxios = setupCache(axios);
const cachedAxios = axios;

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
// const BASE_URL = "/api/data/2.5/weather"; // Use the proxy
const BASE_URL = import.meta.env.VITE_APP_API_URL;

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
    const response = await cachedAxios.get(BASE_URL, {
      params: {
        q: query,
        appid: API_KEY,
        units: "metric",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
};
