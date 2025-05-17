import { useState } from "react";
import { SearchNextSteps, SearchTips } from "./components/SearchSuggestions";
import { useSearchFlashcard } from "./hooks/useSearchFlashcard";
import SearchInput from "./components/SearchInput";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import SearchResultCard from "./components/SearchResultCard";

export default function SearchPage() {
  const [searchWord, setSearchWord] = useState("");
  const { search, searchLoading, results } = useSearchFlashcard({ searchWord });
  const numberOfResults = 5;

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Search a word or phrase...</h1>

        {/* Search input */}
        <SearchInput searchWord={searchWord} setSearchWord={setSearchWord} handleSearch={() => search()} searchLoading={searchLoading} />

        {/* Search results */}
        {searchLoading ? <CustomLoader /> : <SearchResultCard results={results} />}

        {/* search suggestions */}
        {!searchLoading && (results.length === 0 ? <SearchTips /> : <SearchNextSteps />)}
      </div>
    </div>
  );
}
