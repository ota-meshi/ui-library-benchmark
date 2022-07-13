import { Component, createEffect, createSignal, Index, on } from "solid-js";
import classes from "./App.module.css";
import { Item } from "./components/Item";
import { SearchBox } from "./components/SearchBox";
import { itemMap } from "./data/items";
import { queueTask } from "./queueTask";

type SearchQuery = {
  prev: string;
  current: string;
  threshold: number;
};

const App: Component = () => {
  const [input, setInput] = createSignal("");
  const [searchQuery, setSearchQuery] = createSignal<SearchQuery>({
    prev: "",
    current: "",
    threshold: 0,
  });

  let taskId = 0;
  createEffect(
    on(input, (input) => {
      const t = ++taskId;
      setSearchQuery({
        prev: searchQuery().prev,
        current: input,
        threshold: 0,
      });

      let threshold = 0;
      step();

      function step() {
        if (t !== taskId) {
          return;
        }
        threshold += 100;
        // console.log(t, threshold);
        if (threshold < itemMap.size) {
          setSearchQuery((query) => ({
            ...query,
            threshold,
          }));
          queueTask(step);
        } else {
          setSearchQuery({
            prev: input,
            current: input,
            threshold,
          });
        }
      }
    })
  );

  const onChange = (input: string) => {
    setInput(input);
  };

  return (
    <>
      <div classList={{ [classes.pokemonList]: true }}>
        <Index each={Array.from(itemMap.keys())}>
          {(id, index) => (
            <Item
              id={id()}
              searchQuery={
                index < searchQuery().threshold
                  ? searchQuery().current
                  : searchQuery().prev
              }
            />
          )}
        </Index>
      </div>
      <footer classList={{ [classes.footer]: true }}>
        <p>
          Data is obtained from{" "}
          <a href="https://pokeapi.co/" rel="external">
            PokéAPI
          </a>
          .
        </p>
      </footer>
      <div classList={{ [classes.searchBox]: true }}>
        <SearchBox input={input()} onChange={onChange} />
      </div>
    </>
  );
};

export default App;
