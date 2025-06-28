import { useState } from "react";
import { useSearchFlashcard } from "./hooks/useSearchFlashcard";
import { SearchNextSteps, SearchTips } from "./components/SearchSuggestions";
import SearchInput from "./components/SearchInput";
import SearchResultCard from "./components/SearchResultCard";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import AlertMessage from "@/components/custom-ui/AlertMessage";

export default function SearchPage() {
  const [searchWord, setSearchWord] = useState("");
  const { search, searchLoading, results, error } = useSearchFlashcard({ searchWord });
  const numberOfResults = 5;

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Search a word or phrase...</h1>
        {/* search input */}
        <SearchInput searchWord={searchWord} setSearchWord={setSearchWord} handleSearch={() => search()} searchLoading={searchLoading} />

        {/* search results */}
        {searchLoading ? <CustomLoader /> : <SearchResultCard results={results.slice(0, numberOfResults)} />}

        {/* error message */}
        {error && <AlertMessage type="error" message={error} />}

        {/* search suggestions */}
        {!searchLoading && (results.length === 0 ? <SearchTips /> : <SearchNextSteps />)}
      </div>
    </div>
  );
}
