<template>
    <div v-if="weatherData" class="weather-data">
      <h2>{{ weatherData.name }}, {{ weatherData.sys.country }}</h2>
      <p>Temperature: {{ weatherData.main.temp }}°C</p>
      <p>Humidity: {{ weatherData.main.humidity }}%</p>
      <p>Wind Speed: {{ weatherData.wind.speed }} m/s</p>
      <p>Pressure: {{ weatherData.main.pressure }} hPa</p>
      <p>Sunrise: {{ formatTime(weatherData.sys.sunrise) }}</p>
      <p>Sunset: {{ formatTime(weatherData.sys.sunset) }}</p>
      <img
        :src="`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}.png`"
        :alt="weatherData.weather[0].description"
      />
      <p>{{ weatherData.weather[0].description }}</p>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent } from 'vue';
  import type { PropType } from 'vue';
  import type { WeatherData } from '../weatherService.ts';
  
  export default defineComponent({
    name: 'WeatherList',
    props: {
      weatherData: {
        type: Object as PropType<WeatherData | null>,
        required: false,
        default: null,
      },
    },
    setup() {
      const formatTime = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleTimeString();
      };
  
      return {
        formatTime,
      };
    },
  });
  </script>
  
  <style scoped>
  .weather-data {
    margin-top: 20px;
  }
  </style>