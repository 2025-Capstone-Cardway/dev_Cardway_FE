import { useEffect, useRef, useState } from "react";
import apiClient from "../api/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const callLocationBenefitAPI = async (lat: number, long: number) => {
  try {
    const res = await apiClient.post("/api/notification/check", {
      latitude: lat,
      longitude: long,
    });

    const data = res.data?.data;
    if (data?.hasAvailableBenefits && data.benefit) {
      const benefit = data.benefit;

      toast.success(
        `${benefit.partnerName} 혜택 발견! =>  💸${benefit.cardName}`,
        {
          autoClose: 5000,
          position: "top-center",
        }
      );
    } else {
      console.log("혜택 없음");
    }
  } catch (e) {
    console.error("혜택 API 호출 실패:", e);
    toast.error("근처 혜택 정보를 가져오는 데 실패했어요.");
  }
};

export const useLocationBenefitChecker = () => {
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const lastMovedAtRef = useRef<number | null>(null);
  const prevPositionRef = useRef<{ lat: number; long: number } | null>(null);

  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const newPosition = { lat: latitude, long: longitude };

        setUserPosition(newPosition);

        const prev = prevPositionRef.current;

        if (
          !prev ||
          getDistanceFromLatLonInMeters(
            prev.lat,
            prev.long,
            newPosition.lat,
            newPosition.long
          ) > 1
        ) {
          // 위치 변경됨
          lastMovedAtRef.current = Date.now();
          prevPositionRef.current = newPosition;
        }
      },
      (err) => {
        console.error("GPS 위치 추적 실패:", err);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, []);

  // 10초 간격 체크: 위치가 60초간 안 바뀌면 API 호출
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();

      if (lastMovedAtRef.current && userPosition) {
        const diff = (now - lastMovedAtRef.current) / 1000;
        // console.log("정지 시간:", diff.toFixed(1), "초");

        if (diff > 60) {
          callLocationBenefitAPI(userPosition.lat, userPosition.long);
          lastMovedAtRef.current = now;
        }
      }
    }, 10 * 1000);

    return () => clearInterval(interval);
  }, [userPosition]);
};
