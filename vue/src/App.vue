<script setup lang="ts">
  import { computed, nextTick, ref, watchEffect } from 'vue';
import { itemMap } from './data/items';
import Item from './components/Item.vue';
import SearchBox from './components/SearchBox.vue';
import { queueTask } from './queueTask';

  const itemIds = computed(() => Array.from(itemMap.keys()))

  const input = ref('');
  const searchQuery = ref({
    prev: "",
    current: "",
    threshold: 0,
  });

  watchEffect((onCleanup) => {
    searchQuery.value.current = input.value;
    searchQuery.value.threshold = 0;

    let threshold = 0;
    let canceled = false;
    onCleanup(() => (canceled = true));
    nextTick().then(step);

    function step() {
      if (canceled) {
        return;
      }
      searchQuery.value.threshold = threshold += 100;
      if (threshold < itemIds.value.length) {
        queueTask(step);
      } else {
        searchQuery.value.prev = input.value;
      }
    }
  });
</script>

<template>
  <div class="pokemonList">
    <Item v-for="(id, index) in itemIds" :key="id" :id="id" :search-query="index < searchQuery.threshold
        ? searchQuery.current
        : searchQuery.prev" />
  </div>
  <footer>
    <p>
      Data is obtained from
      <a href="https://pokeapi.co/" rel="external">
        PokéAPI
      </a>
      .
    </p>
  </footer>
  <div class="searchBox">
    <SearchBox v-model="input" />
  </div>
</template>

<style scoped>
.pokemonList {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  grid-gap: 20px;
  margin: 20px;
}

.searchBox {
  position: fixed;
  top: 50vh;
  left: 50vw;
  transform: translate(-50%, -50%);
}

footer {
  text-align: center;
}
</style>
