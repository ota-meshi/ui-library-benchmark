<script lang="ts">
  import { itemMap } from "../data/items";

  /**
   * ID of item
   */
  export let id: string;
  /**
   * Search query, in lowercase
   */
  export let searchQuery: string;

  $: item = itemMap.get(id);
  $: ({ unmatched, prefix, mark, suffix } = (() => {
    if (!item) {
      return {
        unmatched: false,
        prefix: "",
        mark: "",
        suffix: "",
      };
    }
    if (!searchQuery) {
      return {
        unmatched: false,
        prefix: item.en,
        mark: "",
        suffix: "",
      };
    }
    const name = item.en.toLowerCase();
    const searchIndex = name.indexOf(searchQuery);
    if (searchIndex === -1) {
      return {
        unmatched: true,
        prefix: item.en,
        mark: "",
        suffix: "",
      };
    }
    const prefix = item.en.substring(0, searchIndex);
    const mark = item.en.substring(
      searchIndex,
      searchIndex + searchQuery.length
    );
    const suffix = item.en.substring(searchIndex + searchQuery.length);
    return {
      unmatched: false,
      prefix,
      mark,
      suffix,
    };
  })());
</script>

{#if item}
  <div class="wrapper">
    <div class="id">{id}</div>
    <div>
      <span class="name" class:unmatchedName={unmatched}>
        {prefix}{#if mark}<mark>{mark}</mark>{/if}{suffix}
      </span>
    </div>
    <div>{item.ja}</div>
  </div>
{/if}

<style>
  .wrapper {
    background-color: var(--bg-sub-color);
  }

  .id {
    color: var(--text-sub-color);
  }

  .name > mark {
    font-weight: bold;
  }

  .unmatchedName {
    color: var(--text-sub-color);
  }
</style>
