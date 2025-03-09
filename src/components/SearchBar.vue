<template>
  <div class="search-bar">
    <input
      type="text"
      v-model="query"
      placeholder="Search for location"
      @keyup.enter="handleSearch"
    />
    <button
      class="button is-primary"
      @click="handleSearch"
      :disabled="!query.trim()"
    >
      Search
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
  name: "SearchBar",
  emits: ["search"], // Define the event this component emits
  setup(_, { emit }) {
    const query = ref("");

    const handleSearch = () => {
      if (query.value.trim()) {
        emit("search", query.value.trim()); // Emit the search query to the parent
      }
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
}
</style>