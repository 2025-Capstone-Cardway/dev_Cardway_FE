import { useState } from 'react';
import type{Card, Benefit } from './types/Card';
import CardView from './Card';
import basicCardImage from '../../assets/card/basiccard.png'

const mockBenefits: Benefit[] = [
    { category: "문화", title: "모든가맹점", comment: "구체적인 혜택", parterName: []},
    { category: "영화관", title: "모든가맹점", comment: "월 1회 제공", parterName: []}
];

const initialMockCards: Card[] = [
    {
        id: 1,
        name: "국민 노리 카드",
        type: "체크카드",
        company: "KB국민",
        image: basicCardImage, 
        benefit: mockBenefits, 
        isMainCard: true
    },
    {
        id: 2,
        name: "신한 마이 베네핏",
        type: "신용카드",
        company: "신한카드",
        image: basicCardImage,
        benefit: [
            {
                category: "서점",
                title: "모든가맹점 할인",
                comment: "일 1회, 월 4회",
                parterName: ["교보문고"]
            }
        ],
        isMainCard: false
    }
]


export default function CardList(){
    const [cards, setCards] = useState<Card[]>(initialMockCards);

    const handleToggleMainCard = (cardId: number) => {
        setCards(prevCards => 
            prevCards.map(card => ({
                ...card,
                isMainCard: card.id === cardId
            }))
        );
    };

    return(
        <div className="w-full px-4 max-w-[480px] mx-auto space-y-3 -mt-4">
            {/* Add Card Button */}
            <div className="flex justify-center">
                <button 
                    className="flex flex-row items-center justify-center gap-3 px-5 h-[40px] bg-white border border-[rgba(17,17,67,0.1)] rounded-[28px] hover:bg-gray-50 transition-colors"
                    style={{
                        boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {/* Plus Icon in Circle */}
                    <div className="w-6 h-6 rounded-full border-2 border-[#111143] flex items-center justify-center">
                        <svg 
                            width="14" 
                            height="14" 
                            viewBox="0 0 14 14" 
                            fill="none" 
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path 
                                d="M7 1V13M1 7H13" 
                                stroke="#111143" 
                                strokeWidth="2" 
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>
                    <span className="text-base font-medium text-[#111143]">Add Card</span>
                </button>
            </div>

            {cards.map((card) => (
                <CardView 
                    key={card.id} 
                    card={card}
                    onToggleMainCard={handleToggleMainCard}
                />
            ))}
        </div>
    );
}