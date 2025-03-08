<template>
    <div class="search-bar">
      <input
        type="text"
        v-model="query"
        placeholder="Search by city"
      />
      <button @click="handleSearch">Search</button>
    </div>
  </template>
  
  <script lang="ts">
  import { defineComponent, ref } from 'vue';

  
  export default defineComponent({
  name: 'SearchBar',
  emits: ['search'], // Define the event this component emits
  setup(_, { emit }) {
    const query = ref('');

    const handleSearch = () => {
      emit('search', query.value); // Emit the search query to the parent
    };

    return {
      query,
      handleSearch,
    };
  },
});
  </script>
  
  <style scoped>
  .search-bar {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
  }
  </style>