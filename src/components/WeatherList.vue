<template>
  <div class="weather-grid">
    <div v-if="forecasts.length === 0" class="notification is-warning">
      Please search for a forecast
    </div>
    <div
      v-for="(forecasts, index) in forecasts"
      :key="index"
      class="box weather-card"
    >
      <h2 class="title is-4">
        {{ forecasts.name }}, {{ forecasts.sys.country }}
      </h2>
      <div class="content">
        <p><strong>Humidity:</strong> {{ forecasts.main.humidity }}%</p>
        <p><strong>Wind Speed:</strong> {{ forecasts.wind.speed }} m/s</p>
        <p><strong>Pressure:</strong> {{ forecasts.main.pressure }} hPa</p>
        <p><strong>Sunrise:</strong> {{ formatTime(forecasts.sys.sunrise) }}</p>
        <p><strong>Sunset:</strong> {{ formatTime(forecasts.sys.sunset) }}</p>
        <p><strong>Temperature:</strong> {{ forecasts.main.temp }}°C</p>
        <img
          :src="`https://openweathermap.org/img/wn/${forecasts.weather[0].icon}.png`"
          :alt="forecasts.weather[0].description"
        />
        <p>{{ forecasts.weather[0].description }}</p>
      </div>
      <button
        class="button is-danger is-small"
        @click="removeForecast(index)"
        aria-label="Remove forecast"
      >
        Remove
      </button>
    </div>
  </div>
</template>
  
<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { WeatherData } from "../weatherService";

export default defineComponent({
  name: "WeatherList",
  props: {
    forecasts: {
      type: Array as PropType<WeatherData[]>,
      required: true,
    },
    removeForecast: {
      type: Function as PropType<(index: number) => void>,
      required: true,
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
/* Grid layout */
.weather-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
  align-items: start;
}
.weather-card {
  padding: 1rem;
  margin: 0.5rem 0;
  max-width: 300px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>