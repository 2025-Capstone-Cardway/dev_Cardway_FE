import { useState } from 'react';
import type { Card } from '../mycard/types/Card';
import basicCardImage from '../../assets/card/basiccard.png';

const mockCards: Card[] = [
  {
    id: 1,
    name: "국민 노리 카드",
    type: "체크카드",
    company: "KB국민",
    image: basicCardImage,
    isMainCard: true
  },
  {
    id: 2,
    name: "신한 마이 베네핏",
    type: "신용카드",
    company: "신한카드",
    image: basicCardImage,
    isMainCard: false
  },
  {
    id: 3,
    name: "우리 카드",
    type: "신용카드",
    company: "우리카드",
    image: basicCardImage,
    isMainCard: false
  },
  {
    id: 4,
    name: "하나 카드",
    type: "체크카드",
    company: "하나카드",
    image: basicCardImage,
    isMainCard: false
  }
];

export default function MyWallet() {
  const [cards] = useState<Card[]>(mockCards);

  return (
    <div className="w-full py-6 bg-white">
      <div className="px-6">
        <h2 className="text-lg font-bold text-text-main mb-4">내 지갑</h2>
      </div>
      
      {/* 가로 스크롤 카드 리스트 */}
      <div className="px-8">
        <div className="overflow-x-auto scrollbar-hide -mx-2">
          <div className="flex gap-4 px-2 pb-2">
            {cards.map((card) => (
              <div 
                key={card.id} 
                className="shrink-0"
              >
                {/* 카드 이미지 */}
                <div className="w-24 h-36 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src={card.image} 
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* 카드 정보 */}
                <div className="mt-2 text-center">
                  <p className="text-xs font-medium text-text-main truncate w-24">
                    {card.name}
                  </p>
                  <p className="text-[10px] text-gray-500 mt-0.5">
                    {card.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

