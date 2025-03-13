<template>
  <div class="modal" :class="{ 'is-active': isOpen }">
    <div class="modal-background" @click="closeModal"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">
          Long Term Forecast for {{ cityName }}, {{ countryCode }}
        </p>
        <button class="delete" aria-label="close" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <div v-if="isLoading">Loading...</div>
        <div v-else-if="longTermForecast.length > 0">
          <div
            v-for="(forecast, index) in longTermForecast"
            :key="index"
            class="box"
          >
            <p><strong>Date:</strong> {{ formatDate(forecast.dt) }}</p>
            <p>
              <strong>Temperature:</strong> {{ forecast.main.temp || "N/A" }}°C
            </p>
            <p>
              <strong>Humidity:</strong> {{ forecast.main.humidity || "N/A" }}%
            </p>
            <p>
              <strong>Wind Speed:</strong>
              {{ forecast.wind.speed || "N/A" }} m/s
            </p>
            <p>
              <strong>Weather:</strong>
              {{ forecast.weather?.[0]?.description || "N/A" }}
            </p>
            <img
              v-if="forecast.weather?.[0]?.icon"
              :src="`https://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`"
              :alt="forecast.weather?.[0]?.description || 'Weather icon'"
            />
          </div>
        </div>
        <div v-else>
          <p>No forecast data available.</p>
        </div>
      </section>
      <footer class="modal-card-foot">
        <button class="button" @click="closeModal">Close</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import { fetchLongTermForecast } from "../weatherService";
import type { LongTermForecastData } from "../weatherService";

export default defineComponent({
  name: "LongTermForecastModal",
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    cityName: {
      type: String,
      required: true,
    },
    countryCode: {
      type: String,
      required: true,
    },
  },
  emits: ["close"],
  setup(props, { emit }) {
    const longTermForecast = ref<LongTermForecastData[]>([]);
    const isLoading = ref(false);

    const closeModal = () => {
      emit("close");
    };

    const loadForecast = async () => {
      isLoading.value = true;
      try {
        const data = await fetchLongTermForecast(props.cityName);
        if (Array.isArray(data) && data.length > 0) {
          longTermForecast.value = data;
        } else {
          console.error("No forecast data received from API");
          longTermForecast.value = [];
        }
      } catch (error) {
        console.error("Error fetching long-term forecast:", error);
        longTermForecast.value = [];
      } finally {
        isLoading.value = false;
      }
    };

    const formatDate = (timestamp: number): string => {
      try {
        return new Date(timestamp * 1000).toLocaleDateString();
      } catch (error) {
        console.error("Error formatting date:", error);
        return "Invalid date";
      }
    };

    return {
      longTermForecast,
      isLoading,
      closeModal,
      loadForecast,
      formatDate,
    };
  },
  watch: {
    isOpen(newVal) {
      if (newVal) {
        this.loadForecast();
      }
    },
  },
});
</script>

<style scoped>
.modal-card {
  width: 80%;
  max-width: 600px;
}
</style>