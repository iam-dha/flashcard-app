import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

type SearchInputProps = {
  searchWord: string;
  setSearchWord: (word: string) => void;
  handleSearch: () => void;
  searchLoading: boolean;
};

export default function SearchInput({ searchWord, setSearchWord, handleSearch, searchLoading }: SearchInputProps) {
  return (
    <div className="my-8 flex gap-2">
      <Input
        type="text"
        placeholder="Search a word or phrase in English or Vietnamese..."
        value={searchWord}
        onChange={(e) => setSearchWord(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSearch()}
        className="!rounded-2xl py-6 bg-input liquid-glass"
      />
      <Button
        onClick={() => {
          handleSearch();
        }}
        disabled={searchLoading}
        size="icon"
        className="h-12 w-12 rounded-2xl bg-accent text-accent-foreground hover:bg-accent/80 transition-colors duration-300 disabled:opacity-50 disabled:pointer-events-none"
      >
        <SearchIcon className="h-5 w-5" />
      </Button>
    </div>
  );
}
