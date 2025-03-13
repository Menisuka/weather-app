<template>
  <div class="weather-grid">
    <div v-if="forecasts.length === 0" class="notification is-warning">
      Please search for a forecast
    </div>
    <div
      v-for="(forecast, index) in forecasts"
      :key="index"
      class="box weather-card"
      @click="openModal(forecast)"
    >
      <h2 class="title is-4">
        {{ forecast.name }}, {{ forecast.sys?.country || "N/A" }}
      </h2>
      <div class="content">
        <p>
          <strong>Humidity:</strong> {{ forecast.main?.humidity || "N/A" }}%
        </p>
        <p>
          <strong>Wind Speed:</strong> {{ forecast.wind?.speed || "N/A" }} m/s
        </p>
        <p>
          <strong>Pressure:</strong> {{ forecast.main?.pressure || "N/A" }} hPa
        </p>
        <p>
          <strong>Sunrise:</strong>
          {{ formatTime(forecast.sys?.sunrise) || "N/A" }}
        </p>
        <p>
          <strong>Sunset:</strong>
          {{ formatTime(forecast.sys?.sunset) || "N/A" }}
        </p>
        <p>
          <strong>Temperature:</strong> {{ forecast.main?.temp || "N/A" }}°C
        </p>
        <img
          v-if="forecast.weather?.[0]?.icon"
          :src="`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`"
          :alt="forecast.weather?.[0]?.description || 'Weather icon'"
        />
        <p>{{ forecast.weather?.[0]?.description || "N/A" }}</p>
      </div>
      <button
        class="button is-danger is-small"
        @click.stop="removeForecast(index)"
        aria-label="Remove forecast"
      >
        Remove
      </button>
    </div>
    <LongTermForecastModal
      :isOpen="isModalOpen"
      :cityName="selectedCityName"
      :countryCode="selectedCountryCode"
      @close="closeModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import type { PropType } from "vue";
import LongTermForecastModal from "../components/LongTermForecastModal.vue";
import type { WeatherData } from "../weatherService";

export default defineComponent({
  name: "WeatherList",
  components: {
    LongTermForecastModal,
  },
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
    const isModalOpen = ref(false);
    const selectedCityName = ref("");
    const selectedCountryCode = ref("");

    const openModal = (forecast: WeatherData) => {
      selectedCityName.value = forecast.name;
      selectedCountryCode.value = forecast.sys.country;
      isModalOpen.value = true;
    };

    const closeModal = () => {
      isModalOpen.value = false;
    };

    const formatTime = (timestamp: number): string => {
      try {
        return new Date(timestamp * 1000).toLocaleTimeString();
      } catch (error) {
        console.error("Error formatting time:", error);
        return "Invalid time";
      }
    };

    return {
      isModalOpen,
      selectedCityName,
      selectedCountryCode,
      openModal,
      closeModal,
      formatTime,
    };
  },
});
</script>

<style scoped>
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
  cursor: pointer;
}
</style>