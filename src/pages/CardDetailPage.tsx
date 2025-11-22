import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Card } from '../components/mycard/types/Card';
import basicCardImage from '../assets/card/basiccard.png';


const mockCards: Card[] = [
    {
        id: 1,
        name: "국민 노리 카드",
        type: "체크카드",
        company: "KB국민",
        image: basicCardImage,
        benefit: [
            { category: "문화", title: "모든가맹점", comment: "구체적인 혜택", parterName: []},
            { category: "영화관", title: "모든가맹점", comment: "월 1회 제공", parterName: ["CGV", "메가박스"]}
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
            },
            {
                category: "카페",
                title: "5% 할인",
                comment: "월 3회",
                parterName: ["투썸플레이스", "이디야"]
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
        <div className="min-h-screen flex flex-col bg-white">
            {/* 뒤로가기 버튼 */}
            <div className="pt-6 px-4">
                <button
                    onClick={() => navigate('/cardpage')}
                    className="text-[#111143] hover:opacity-70 transition-opacity"
                    aria-label="뒤로가기"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                </button>
            </div>

            {/* 카드 이미지 */}
            <div className="flex flex-col items-center gap-4 px-4 pt-6">
                {card.image && (
                    <img 
                        src={card.image}
                        alt={`${card.name} 카드 이미지`}
                        className="w-[120px] h-[185px] object-cover rounded-[10px] shadow-lg"
                    />
                )}
                
                {/* 카드 정보 */}
                <div className="text-center mb-4" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                    <h1 className="text-xl font-bold text-[#111143] mb-1">{card.name}</h1>
                    <p className="text-sm text-[#757575]">{card.company}</p>
                    {card.type && (
                        <span className="inline-block mt-2 px-3 py-1 bg-gray-50 border border-[#D9D9D9] rounded-full text-xs text-[#757575]">
                            {card.type}
                        </span>
                    )}
                </div>

                {/* 카드 삭제 버튼 */}
                <button 
                    onClick={() => {
                        //API 연동 후 실제 삭제 로직 구현
                        navigate('/cardpage');
                    }}
                    className="px-6 py-2 bg-white text-[#111143] text-sm font-medium rounded-[28px] border border-[rgba(17,17,67,0.1)] hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
                    style={{
                        boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1)',
                        fontFamily: 'Noto Sans KR, sans-serif'
                    }}
                >
                    카드 삭제하기
                </button>
            </div>

            {/* 혜택 정보 영역 */}
            <div className="flex-1 px-12 pb-20 mt-8">
                {card.benefit && card.benefit.length > 0 && (
                    <div className="space-y-6" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                        {card.benefit.map((benefit, index) => (
                            <div key={index}>
                                <div className="space-y-4 py-5">
                                    <h2 className="text-lg font-bold text-black">{benefit.category}</h2>
                                    <div className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                                        <span className="text-sm text-black">
                                            {benefit.title}
                                            {benefit.comment && ` ${benefit.comment}`}
                                        </span>
                                    </div>

                                    {benefit.parterName && benefit.parterName.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {benefit.parterName.map((partner, idx) => (
                                                <span
                                                    key={idx}
                                                    className="inline-block px-3 py-1 bg-gray-50 border border-[#D9D9D9] rounded-full text-xs text-[#757575]"
                                                >
                                                    {partner}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                <div className="border-b border-gray-200"></div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

