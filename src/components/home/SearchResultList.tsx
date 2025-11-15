interface SearchResultListProps {
  results: kakao.maps.services.PlacesSearchResult;
  handleSelectPlace: (
    place: kakao.maps.services.PlacesSearchResultItem
  ) => void;
  setIsSelected: (status: boolean) => void;
}

export default function SearchResultList({
  results,
  handleSelectPlace,
  setIsSelected,
}: SearchResultListProps) {
  const handleSelect = (place: kakao.maps.services.PlacesSearchResultItem) => {
    handleSelectPlace(place);
    setIsSelected(true);
  };

  return (
    <div className="bg-white w-11/12 max-h-80 overflow-y-auto rounded-2xl shadow-lg border border-gray-200 p-2 animate-fadeIn">
      {results.map((place, idx) => (
        <div
          key={idx}
          className="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
          onClick={() => handleSelect(place)}
        >
          <p className="font-semibold text-gray-800 text-sm">
            {place.place_name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {place.road_address_name || place.address_name}
          </p>
          {place.category_name && (
            <p className="text-xs text-orange-main mt-1">
              {place.category_name}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
