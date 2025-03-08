<template>
  <div class="container">
    <h1 class="title is-1 has-text-centered mt-5">Weather App</h1>
    <SearchBar @search="handleSearch" />
    <WeatherList :weatherData="weatherData" />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import SearchBar from './components/SearchBar.vue';
import WeatherList from './components/WeatherList.vue';
import { fetchWeather } from './weatherService.ts';
import type { WeatherData } from './weatherService.ts';

export default defineComponent({
  name: 'App',
  components: {
    SearchBar,
    WeatherList,
  },
  setup() {
    const weatherData = ref<WeatherData | null>(null);

    const handleSearch = async (query: string) => {
      try {
        const data = await fetchWeather(query);
        weatherData.value = data;
      } catch (error) {
        console.error('Error fetching weather:', error);
        alert('Failed to fetch weather data. Please try again.');
      }
    };

    return {
      weatherData,
      handleSearch,
    };
  },
});
</script>
