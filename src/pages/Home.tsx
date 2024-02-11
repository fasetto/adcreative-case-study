import { useEffect, useState } from "react";
import { tv } from "tailwind-variants";
import { useAsyncList } from "react-stately";

import { Select } from "../components";
import useDebounce from "../hooks/useDebounce";
import type { Character } from "../types";
import highlightSearchTerm from "../utils/highligthSearchTerm";

const styles = tv({
  slots: {
    title: "text-2xl font-bold mt-8",
    base: "flex flex-col items-center",
  },
});

const { title, base } = styles();

const apiUrl = import.meta.env.VITE_API_URL;

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");

  const list = useAsyncList<Character>({
    async load({ filterText, signal, cursor }) {
      if (!filterText || filterText.length < 3) {
        const response = await fetch(cursor || `${apiUrl}/character`, {
          signal,
        });

        const data = await response.json();
        return {
          items: data.results,
          cursor: data.info.next,
        };
      }

      const search = new URLSearchParams({ name: filterText });
      const response = await fetch(cursor || `${apiUrl}/character?${search}`, {
        signal,
      });

      const data = await response.json();
      const results = data.results as Character[];

      return {
        items: results.map((item) => ({
          ...item,
          name: highlightSearchTerm(filterText, item.name),
        })),
        cursor: data.info.next,
      };
    },
  });

  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    list.setFilterText(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  return (
    <main className={base()}>
      <h1 className={title()}>Rick & Morty Characters</h1>

      <Select
        className="mt-8"
        items={list.items}
        isLoading={list.isLoading}
        placeholder="Select a character"
        onSearch={setSearchTerm}
        onScrollToBottom={list.loadMore}
      />
    </main>
  );
}
