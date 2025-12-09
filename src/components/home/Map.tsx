import { useEffect, useState, useRef } from "react";
import SearchBar from "./SearchBar";
import usePositionStore from "../../store/position";
import SearchResultList from "./SearchResultList";
import curPos from "../../assets/curPosIcon.png";
import Modal from "./Modal";

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export default function Map() {
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const { setPosition } = usePositionStore();
  const [searchPlace, setSearchPlace] =
    useState<kakao.maps.services.PlacesSearchResultItem | null>(null);
  const [searchWord, setSearchWord] = useState<string>("");
  const [searchResults, setSearchResults] =
    useState<kakao.maps.services.PlacesSearchResult>([]);
  const [isSelected, setIsSelected] = useState<boolean>(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude } = pos.coords;
      setPosition(latitude, longitude);

      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        if (!container) return;

        const map = new window.kakao.maps.Map(container, {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        });
        mapRef.current = map;

        const marker = new window.kakao.maps.Marker({
          position: new window.kakao.maps.LatLng(latitude, longitude),
          map,
        });
        markerRef.current = marker;

        window.kakao.maps.event.addListener(
          map,
          "click",
          (mouseEvent: kakao.maps.event.MouseEvent) => {
            const latlng = mouseEvent.latLng;
            markerRef.current?.setMap(null);

            const newMarker = new window.kakao.maps.Marker({
              position: latlng,
              map,
            });

            markerRef.current = newMarker;
            map.panTo(latlng);
            setSearchPlace(null);
            setPosition(latlng.getLat(), latlng.getLng());
          }
        );
      });
    });
  }, []);

  useEffect(() => {
    if (!mapRef.current || !searchWord) return;

    const ps = new window.kakao.maps.services.Places();
    const center = mapRef.current.getCenter();

    ps.keywordSearch(
      searchWord,
      (data, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          setSearchResults(data);
        } else {
          setSearchResults([]);
        }
      },
      {
        location: center,
        radius: 5000,
        sort: window.kakao.maps.services.SortBy.DISTANCE,
      }
    );
  }, [searchWord]);

  const handleSelectPlace = (
    place: kakao.maps.services.PlacesSearchResultItem
  ) => {
    const map = mapRef.current;
    if (!map) return;
    setSearchPlace(place);
    setSearchResults([]);
    setSearchWord("");
    const pos = new window.kakao.maps.LatLng(Number(place.y), Number(place.x));
    markerRef.current?.setMap(null);

    const marker = new window.kakao.maps.Marker({
      map,
      position: pos,
    });
    markerRef.current = marker;

    map.panTo(pos);
  };

  const moveToCurPos = () => {
    const map = mapRef.current;
    if (!map) return;

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newLatLng = new window.kakao.maps.LatLng(latitude, longitude);
        setSearchPlace(null);
        markerRef.current?.setMap(null);

        markerRef.current = new window.kakao.maps.Marker({
          map,
          position: newLatLng,
        });

        map.panTo(newLatLng);
        setPosition(latitude, longitude);
      },
      () => alert("위치 권한이 필요합니다.")
    );
  };

  return (
    <div className="relative w-full h-dvh overflow-hidden">
      <div id="map" className="z-0 w-full h-dvh" />

      <div className="flex flex-col items-center">
        <SearchBar
          setSearchWord={setSearchWord}
          setIsSelected={setIsSelected}
          setSearchResults={setSearchResults}
        />
      </div>

      <div className="absolute top-20 w-full flex flex-row h-6 justify-end px-5">
        <div className="flex flex-row border w-7 h-7 items-center rounded-full justify-center bg-white shadow cursor-pointer">
          <img
            src={curPos}
            alt="현위치"
            className="w-5 h-5"
            onClick={moveToCurPos}
          />
        </div>
      </div>

      <Modal searchPlace={searchPlace} />

      {searchResults.length > 0 && !isSelected && (
        <div className="absolute top-20 w-full flex justify-center">
          <SearchResultList
            results={searchResults}
            handleSelectPlace={handleSelectPlace}
            setIsSelected={setIsSelected}
          />
        </div>
      )}
    </div>
  );
}
