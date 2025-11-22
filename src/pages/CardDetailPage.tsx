import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Card } from '../components/mycard/types/Card';
import CardDetailHeader from '../components/carddetail/CardDetailHeader';
import DeleteCardButton from '../components/carddetail/DeleteCardButton';
import BenefitList from '../components/carddetail/BenefitList';
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

    const handleDelete = () => {
        //API 연동 후 실제 삭제 로직 구현
        navigate('/cardpage');
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
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

            <CardDetailHeader card={card} />

            <div className="flex flex-col items-center">
                <DeleteCardButton onDelete={handleDelete} />
            </div>

            <BenefitList benefits={card.benefit} />
        </div>
    );
}

