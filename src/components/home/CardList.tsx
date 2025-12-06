import { useEffect, useState } from "react";
import prevIcon from "../../assets/chevron_backward2.png";
import postIcon from "../../assets/chevron_backward.png";
import apiClient from "../../api/axios";
import usePositionStore from "../../store/position";
import CardCard from "./CardCard";
import type { SearchPlaceProps } from "./Modal";

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

export default function CardList({ searchPlace }: SearchPlaceProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { position } = usePositionStore();
  const [nearestPlace, setNearestPlace] =
    useState<kakao.maps.services.PlacesSearchResultItem | null>(null);
  const [cards, setCards] = useState<CardInfo[]>([]);
  console.log("n", nearestPlace);
  console.log("s", searchPlace);
  useEffect(() => {
    if (searchPlace) {
      setNearestPlace(searchPlace);
      return;
    }

    // 🔥 현위치 기반 최근접 매장 탐색
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

                  const nearest = [...data].sort(
                    (a, b) => Number(a.distance) - Number(b.distance)
                  )[0];

                  resolve(nearest);
                },
                {
                  location: new window.kakao.maps.LatLng(
                    position.lat,
                    position.long
                  ),
                  radius: 200,
                  sort: window.kakao.maps.services.SortBy.DISTANCE,
                }
              );
            }
          )
      );

      Promise.all(searchPromises).then((results) => {
        const valid = results.filter(
          (item): item is kakao.maps.services.PlacesSearchResultItem =>
            item !== null
        );

        if (valid.length === 0) {
          setNearestPlace(null);
          return;
        }

        valid.sort((a, b) => Number(a.distance) - Number(b.distance));
        setNearestPlace(valid[0]);
      });
    });
  }, [searchPlace, position.lat, position.long]);

  /**
   * 🔥 nearestPlace가 바뀌면 카드 목록 다시 로딩 + 인덱스 초기화
   */
  useEffect(() => {
    setCurrentIndex(0); // 🔥 버튼 누를 때 axios 다시 요청되는 문제 해결

    const loadCards = async () => {
      if (!nearestPlace?.category_group_code) {
        setCards([]);
        return;
      }

      try {
        const res = await apiClient.get(
          `/api/auth/partners/${nearestPlace.category_group_code}`
        );

        // 백엔드가 List를 직접 반환하므로 res.data가 배열
        const cardData = Array.isArray(res.data) ? res.data : [];
        setCards(cardData);
      } catch (err) {
        console.error("카드 정보 불러오기 오류:", err);
        setCards([]); // 에러 시 빈 배열로 설정
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
