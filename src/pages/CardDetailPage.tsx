import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Card } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';

// TODO: 나중에 API나 상태관리로 대체
const mockCards: Card[] = [
    {
        id: 1,
        name: "국민 노리 카드",
        type: "체크카드",
        company: "KB국민",
        image: basicCardImage,
        benefit: [
            { category: "문화", title: "모든가맹점", comment: "구체적인 혜택", parterName: []},
            { category: "영화관", title: "모든가맹점", comment: "월 1회 제공", parterName: []}
        ],
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
];

export default function CardDetailPage() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<Card | null>(null);

    useEffect(() => {
        // cardId로 카드 찾기
        const foundCard = mockCards.find(c => c.id === Number(cardId));
        if (foundCard) {
            setCard(foundCard);
        } else {
            // 카드를 찾지 못하면 카드 페이지로 리다이렉트
            navigate('/cardpage');
        }
    }, [cardId, navigate]);

    if (!card) {
        return (
            <div className="flex items-center justify-center h-screen">
                <p>로딩 중...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white px-4">
            {/* 뒤로가기 버튼 */}
            <button
                onClick={() => navigate('/cardpage')}
                className="absolute top-8 left-4 text-[#111143] hover:opacity-70 transition-opacity"
                aria-label="뒤로가기"
            >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </button>

            {/* 카드 이미지 */}
            <div className="flex flex-col items-center gap-6">
                {card.image && (
                    <img 
                        src={card.image}
                        alt={`${card.name} 카드 이미지`}
                        className="w-[280px] h-[432px] object-cover rounded-[15px] shadow-2xl"
                    />
                )}
                
                {/* 카드 정보 */}
                <div className="text-center" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    <h1 className="text-2xl font-bold text-[#111143] mb-2">{card.name}</h1>
                    <p className="text-base text-[#757575]">{card.company}</p>
                    {card.type && (
                        <span className="inline-block mt-3 px-4 py-1 bg-gray-50 border border-[#D9D9D9] rounded-full text-sm text-[#757575]">
                            {card.type}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}

