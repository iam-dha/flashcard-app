import { useSearchFlashcard } from "./hooks/useSearchFlashcard";
import { SearchNextSteps, SearchTips } from "./components/SearchSuggestions";
import SearchInput from "./components/SearchInput";
import SearchResultCard from "./components/SearchResultCard";
import CustomLoader from "@/components/custom-ui/CustomLoader";
import AlertMessage from "@/components/custom-ui/AlertMessage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function SearchPage() {
  const { searchWord, setSearchWord, search, searchLoading, results, error } = useSearchFlashcard();
  const { word } = useParams<{ word: string }>();
  const navigate = useNavigate();
  const numberOfResults = 5;

  useEffect(() => {
    if (word) {
      const decodedWord = decodeURIComponent(word);
      setSearchWord(decodedWord);
      // automatically search when word is in URL
      search(decodedWord);
    }
  }, [word]);

  const handleSearch = (searchTerm?: string) => {
    const termToSearch = searchTerm || searchWord;
    if (!termToSearch.trim()) return;
    
    // update URL with the search term
    navigate(`/search/${encodeURIComponent(termToSearch)}`, { replace: true });
    
    // perform the search
    search(termToSearch);
  };

  const handleSearchWordChange = (newWord: string) => {
    setSearchWord(newWord);
  };

  return (
    <div className="container mx-auto space-y-8 py-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-center text-3xl font-bold">Search a word...</h1>
        {/* search input */}
        <SearchInput searchWord={searchWord} setSearchWord={handleSearchWordChange} handleSearch={() => handleSearch()} searchLoading={searchLoading} />

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
