import { useState } from "react";
import type { ChangeEvent } from "react";
import searchIcon from "../../assets/searchIcon.png";
interface SearchBarProps {
  setSearchWord: (word: string) => void;
  setIsSelected: (status: boolean) => void;
  setSearchResults: (result: kakao.maps.services.PlacesSearchResult) => void;
}

export default function SearchBar({
  setSearchWord,
  setIsSelected,
  setSearchResults,
}: SearchBarProps) {
  const [search, setSearch] = useState<string>("");
  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };
  const handleSubmit = () => {
    setSearchWord(search);
  };
  const initialize = () => {
    setIsSelected(false);
    setSearchResults([]);
    setSearch("");
  };
  return (
    <div className="absolute z-50 top-5 w-11/12 h-14 border border-border-main p-2 rounded-full shadow-md flex flex-row justify-between items-center bg-white">
      <input
        placeholder="search"
        className="w-11/12 mx-6 focus:outline-none"
        value={search}
        onClick={initialize}
        onChange={(e) => handleSearch(e)}
        onKeyUp={(e) => e.key === "Enter" && handleSubmit()}
      ></input>
      <img
        src={searchIcon}
        className="w-5 h-5 mx-3"
        onClick={() => handleSubmit()}
      />
    </div>
  );
}
