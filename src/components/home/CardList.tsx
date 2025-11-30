import { useEffect, useState } from "react";
import prevIcon from "../../assets/chevron_backward2.png";
import postIcon from "../../assets/chevron_backward.png";
import axios from "axios";
import usePositionStore from "../../store/position";
import CardCard from "./CardCard";

declare global {
  interface Window {
    kakao: typeof kakao;
  }
}

export interface CardInfo {
  cardCompany: string;
  cardName: string;
  benefitComment: string;
  imageUrl?: string;
}

const CATEGORY_CODES = ["FD6", "CE7", "CS2", "MT1", "CT1", "OL7"] as const;

export default function CardList() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { position } = usePositionStore();
  const [nearestPlace, setNearestPlace] =
    useState<kakao.maps.services.PlacesSearchResultItem | null>(null);
  const [cards, setCards] = useState<CardInfo[]>([]);
  useEffect(() => {
    if (!position.lat || !position.long) return;

    window.kakao.maps.load(() => {
      const places = new window.kakao.maps.services.Places();

      const searchPromises = CATEGORY_CODES.map(
        (code) =>
          new Promise<kakao.maps.services.PlacesSearchResultItem | null>(
            (resolve) => {
              places.categorySearch(
                code,
                (data, status) => {
                  if (status !== window.kakao.maps.services.Status.OK) {
                    resolve(null);
                    return;
                  }
                  if (data.length === 0) {
                    resolve(null);
                    return;
                  }

                  const sorted = [...data].sort(
                    (a, b) => Number(a.distance) - Number(b.distance)
                  );
                  resolve(sorted[0]);
                },
                {
                  location: new window.kakao.maps.LatLng(
                    position.lat,
                    position.long
                  ),
                  radius: 100,
                  sort: window.kakao.maps.services.SortBy.DISTANCE,
                }
              );
            }
          )
      );

      Promise.all(searchPromises).then((results) => {
        const valid = results.filter(
          (p): p is kakao.maps.services.PlacesSearchResultItem => p !== null
        );

        if (valid.length === 0) {
          setNearestPlace(null);
          return;
        }

        valid.sort((a, b) => Number(a.distance) - Number(b.distance));
        setNearestPlace(valid[0]);
      });
    });
  }, [position.lat, position.long]);

  useEffect(() => {
    const loadCards = async () => {
      if (!nearestPlace?.category_group_code) return;

      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/partners/${
            nearestPlace.category_group_code
          }`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TEMP_TOKEN}`,
            },
          }
        );
        console.log("res", res);
        setCards(res.data);
      } catch (err) {
        console.error("카드 정보 불러오기 오류:", err);
      }
    };

    loadCards();
  }, [nearestPlace]);

  return (
    <div className="w-full h-full flex flex-col items-center">
      {nearestPlace ? (
        <>
          <div className="w-full mb-2 px-8">
            <span className="text-orange-main font-bold">
              {nearestPlace.place_name}
            </span>
            <span className="text-gray-400">에서 사용하면 좋아요!</span>
          </div>

          <div className="w-full flex items-center justify-center h-3/4">
            <div className="w-10 flex items-center justify-center">
              <button
                className={`transition-opacity ${
                  currentIndex > 0 && cards.length > 1
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
              >
                <img src={prevIcon} />
              </button>
            </div>

            <div className="w-full h-full overflow-hidden">
              <div
                className="flex transition-transform duration-300 w-full h-full mb-2"
                style={{
                  transform: `translateX(-${currentIndex * 100}%)`,
                }}
              >
                {cards.map((card) => (
                  <div
                    key={card.cardName}
                    className="shrink-0"
                    style={{ width: "100%" }}
                  >
                    <CardCard card={card} />
                  </div>
                ))}
              </div>
            </div>

            <div className="w-8 flex items-center justify-center">
              <button
                className={`transition-opacity ${
                  currentIndex < cards.length - 1 && cards.length > 1
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
              >
                <img src={postIcon} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-gray-400 p-4">
          해당 위치에 내 카드로 혜택받을 수 있는 매장이 없어요🥲
        </div>
      )}
    </div>
  );
}
