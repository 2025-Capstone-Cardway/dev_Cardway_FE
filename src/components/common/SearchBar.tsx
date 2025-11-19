import React from "react";
import searchIcon from "../../assets/searchIcon.png";

export default function SearchBar() {
  return (
    <div className="absolute z-50 top-5 w-11/12 h-14 border border-border-main p-2 rounded-full shadow-md flex flex-row justify-between items-center bg-white">
      <input placeholder="search" className="w-11/12 mx-6"></input>
      <img src={searchIcon} className="w-5 h-5 mx-3" />
    </div>
  );
}
