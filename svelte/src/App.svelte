<script lang="ts">
  import { tick } from "svelte";
  import { get, readable } from "svelte/store";

  import Item from "./components/Item.svelte";
  import SearchBox from "./components/SearchBox.svelte";
  import { itemMap } from "./data/items";
  import { queueTask } from "./queueTask";

  let input = "";
  let searchQueryStore = readable({
    prev: "",
    current: "",
    threshold: 0,
  });
  const itemIds = Array.from(itemMap.keys());

  $: {
    const prev = get(searchQueryStore).prev;
    let threshold = 0;
    searchQueryStore = readable(
      {
        prev,
        current: input,
        threshold,
      },
      (set) => {
        let canceled = false;
        step();
        return () => (canceled = false);

        function step() {
          if (canceled) {
            return;
          }
          threshold += 100;
          set({ prev, current: input, threshold });
          if (threshold < itemIds.length) {
            queueTask(() => {
              tick().then(step);
            });
          }
        }
      }
    );
  }
</script>

<div class="pokemonList">
  {#each itemIds as id, index}
    <Item
      {id}
      searchQuery={index < $searchQueryStore.threshold
        ? $searchQueryStore.current
        : $searchQueryStore.prev}
    />
  {/each}
</div>

<footer>
  <p>
    Data is obtained from <a href="https://pokeapi.co/" rel="external"
      >PokéAPI</a
    >.
  </p>
</footer>

<div class="searchBox">
  <SearchBox bind:value={input} />
</div>

<style>
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
