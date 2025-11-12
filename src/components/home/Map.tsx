import React, { useEffect, useState } from "react";
import SearchBar from "../common/SearchBar";

declare global {
  interface Window {
    kakao: any;
  }
}

export default function Map() {
  const [mapView, setMapView] = useState<any>(null);

  const [position, setPosition] = useState<{ lat: number; long: number }>({
    lat: 0,
    long: 0,
  });
  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setPosition({
        lat: pos.coords.latitude,
        long: pos.coords.longitude,
      });
    });
  }, []);
  useEffect(() => {
    if (position.lat && position.long) {
      window.kakao.maps.load(() => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(position.lat, position.long),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        setMapView(map);
      });
    }
  }, [position]);

  useEffect(() => {
    if (!mapView) return;
    const createdMarker = new window.kakao.maps.Marker({
      position: new window.kakao.maps.LatLng(position.lat, position.long),
    });
    createdMarker.setMap(mapView);

    const handleClick = (mouseEvent: any) => {
      const latlng = mouseEvent.latLng;

      const newPosition = {
        lat: latlng.getLat(),
        long: latlng.getLng(),
      };
      console.log("마커 위치:", newPosition);
      setPosition(newPosition);
      createdMarker.setPosition(latlng);
    };

    window.kakao.maps.event.addListener(mapView, "click", handleClick);
  }, [mapView]);

  return (
    <div className="relative w-screen h-dvh overflow-hidden">
      <div id="map" className="z-0 w-screen h-dvh"></div>
      <div className="flex flex-col items-center">
        <SearchBar />
      </div>
    </div>
  );
}
