<template>
  <div class="container">
    <h1 class="title is-1 has-text-centered mt-5">Weather App</h1>

    <!-- Add Forecast Button -->
    <button class="button is-primary mb-5" @click="isModalOpen = true">
      Add Forecast
    </button>

    <!-- Modal for Adding Forecasts -->
    <div class="modal" :class="{ 'is-active': isModalOpen }">
      <div class="modal-background" @click="isModalOpen = false"></div>
      <div class="modal-card">
        <header class="modal-card-head">
          <p class="modal-card-title">Add Forecast</p>
          <button
            class="delete"
            aria-label="close"
            @click="isModalOpen = false"
          ></button>
        </header>
        <section class="modal-card-body">
          <SearchBar @search="handleSearch" />
        </section>
      </div>
    </div>
    <!-- Weather Forecast List -->
    <WeatherList
      :forecasts="paginatedForecast"
      :removeForecast="removeForecast"
      :currentPage="currentPage"
      :totalPages="totalPages"
      @page-change="handlePageChange"
    />

    <!-- Pagination -->
    <nav
      class="pagination is-centered"
      role="navigation"
      aria-label="pagination"
    >
      <button
        class="pagination-previous"
        :disabled="currentPage === 1"
        @click="handlePageChange(currentPage - 1)"
      >
        Previous
      </button>
      <button
        class="pagination-next"
        :disabled="currentPage === totalPages || forecasts.length === 0"
        @click="handlePageChange(currentPage + 1)"
      >
        Next
      </button>
    </nav>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import SearchBar from "./components/SearchBar.vue";
import WeatherList from "./components/WeatherList.vue";
import { fetchWeather } from "./weatherService";
import type { WeatherData } from "./weatherService";

export default defineComponent({
  name: "App",
  components: {
    SearchBar,
    WeatherList,
  },
  setup() {
    const forecasts = ref<WeatherData[]>([]); //Array to store forecasts
    const isModalOpen = ref(false);
    const currentPage = ref(1);
    const pageSize = 10;

    //Load weatherdata from local storage
    onMounted(() => {
      const storeForecasts = localStorage.getItem("forecasts");
      if (storeForecasts) {
        forecasts.value = JSON.parse(storeForecasts);
      }
    });

    const handleSearch = async (query: string) => {
      try {
        const data = await fetchWeather(query);

        const cityExits = forecasts.value.some(
          (forecast) =>
            forecast.name.toLowerCase() === data.name.toLowerCase() &&
            forecast.sys.country.toLowerCase() ===
              data.sys.country.toLowerCase()
        );

        if (cityExits) {
          alert("This city is already in the list");
          return;
        }

        forecasts.value.push(data); //Add forecast
        localStorage.setItem("forecasts", JSON.stringify(forecasts.value)); //Save to local storage
        isModalOpen.value = false; //Close modal
      } catch (error) {
        console.error("Error fetching weather:", error);
        alert("Failed to fetch weather data. Please try again.");
      }
    };
    //Remove forecast
    const removeForecast = (index: number) => {
      forecasts.value.splice(index, 1); //Remove weatherData
      localStorage.setItem("forecasts", JSON.stringify(forecasts.value)); //Update local storage
    };

    //Pagination logic
    const totalPages = computed(() =>
      Math.ceil(forecasts.value.length / pageSize)
    );
    const paginatedForecast = computed(() => {
      const start = (currentPage.value - 1) * pageSize;
      const end = start + pageSize;
      return forecasts.value.slice(start, end);
    });

    const handlePageChange = (page: number) => {
      currentPage.value = page;
    };

    return {
      forecasts,
      isModalOpen,
      currentPage,
      totalPages,
      paginatedForecast,
      handleSearch,
      removeForecast,
      handlePageChange,
    };
  },
});
</script>

<style scoped>
.modal-card {
  width: 80%;
  max-width: 500px;
}
</style>