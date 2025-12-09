import type { CardInfo } from "./CardList";

import { useState } from "react";
interface CardInfoProps {
  card: CardInfo | null;
}

export default function CardCard({ card }: CardInfoProps) {
  const [isLandscape, setIsLandscape] = useState(false);

  const handleImageLoad = (e: React.UIEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const { naturalWidth, naturalHeight } = img;
    if (naturalWidth > naturalHeight) {
      setIsLandscape(false);
    } else {
      setIsLandscape(true);
    }
  };
  console.log(card);
  if (!card)
    return (
      <div className="w-64 h-40 rounded-xl bg-gray-200 flex items-center justify-center text-gray-500">
        카드 정보 없음
      </div>
    );

  return (
    <div className="w-full h-full rounded-xl shadow-md border border-border-main bg-white overflow-hidden flex flex-row p-2 gap-3">
      <div className="w-1/3 h-full flex">
        {card.cardImage ? (
          <img
            src={card.cardImage}
            onLoad={handleImageLoad}
            className={`items-center justify-center object-contain max-w-full min-h-full ${
              isLandscape ? "" : "rotate-90"
            }`}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400 ">
            카드 이미지
          </div>
        )}
      </div>
      <div className="flex flex-col w-2/3">
        <div className="text-text-main">{card.cardName}</div>
        <div className="text-gray-400 text-sm">{card.cardCompany}</div>
        <div className="text-text-sub text-sm">{card.benefitComment}</div>
      </div>
    </div>
  );
}
