import { useEffect, useRef, useState } from "react";
import apiClient from "../api/axios";

export interface NotificationInfo {
  cardCompany: string;
  cardName: string;
  benefitComment: string;
  cardImage?: string;
}

function getDistanceFromLatLonInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
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
    console.log("try");
    const res = await apiClient.post("/api/notification/check", {
      latitude: lat,
      longitude: long,
    });
    console.log("nofi", res);
    const data = res.data;
    const benefit = data?.data?.benefit;

    if (data?.data?.hasAvailableBenefits && benefit) {
      if (Notification.permission === "granted") {
        new Notification(`${benefit.partnerName} 혜택 발견!`, {
          body: `${benefit.benefitTitle} - ${benefit.benefitComment}`,
          icon: benefit.cardImageUrl,
        });
      } else if (Notification.permission !== "denied") {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          new Notification(`${benefit.partnerName} 혜택 발견!`, {
            body: `${benefit.benefitTitle} - ${benefit.benefitComment}`,
            icon: benefit.cardImageUrl,
          });
        }
      }
    }
  } catch (e) {
    console.error("혜택 API 호출 실패:", e);
  }
};

export const useLocationBenefitChecker = () => {
  const [userPosition, setUserPosition] = useState<{
    lat: number;
    long: number;
  } | null>(null);
  const prevPositionRef = useRef<{ lat: number; long: number } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ✅ 브라우저에서 실시간 위치 추적
  useEffect(() => {
    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setUserPosition({ lat: latitude, long: longitude });
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

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  // ✅ 위치 변화 감지 + 타이머 설정
  useEffect(() => {
    if (!userPosition) return;

    const prev = prevPositionRef.current;

    if (prev) {
      const distance = getDistanceFromLatLonInMeters(
        prev.lat,
        prev.long,
        userPosition.lat,
        userPosition.long
      );

      if (distance > 30) {
        console.log("위치 변경");
        if (timerRef.current) clearTimeout(timerRef.current);
        prevPositionRef.current = userPosition;

        timerRef.current = setTimeout(() => {
          callLocationBenefitAPI(userPosition.lat, userPosition.long);
        }, 10 * 1000);
      }
    } else {
      console.log("최초 위치");
      prevPositionRef.current = userPosition;

      timerRef.current = setTimeout(() => {
        callLocationBenefitAPI(userPosition.lat, userPosition.long);
      }, 10 * 1000);
    }

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [userPosition]);
};
