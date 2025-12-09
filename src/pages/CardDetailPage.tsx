import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { Card } from '../components/mycard/types/Card';
import CardDetailHeader from '../components/carddetail/CardDetailHeader';
import DeleteCardButton from '../components/carddetail/DeleteCardButton';
import BenefitList from '../components/carddetail/BenefitList';
import Loading from '../components/common/Loading';
import { getCardDetail } from '../api/card';

export default function CardDetailPage() {
    const { cardId } = useParams();
    const navigate = useNavigate();
    const [card, setCard] = useState<Card | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCardDetail = async () => {
            if (!cardId) {
                navigate('/cardpage');
                return;
            }

            try {
                setLoading(true);
                setError(null);
                const cardData = await getCardDetail(Number(cardId));
                setCard(cardData);
            } catch (err) {
                console.error('카드 상세 정보 조회 실패:', err);
                setError('카드 정보를 불러올 수 없습니다.');
                // 에러 발생 시 3초 후 카드 페이지로 이동
                setTimeout(() => {
                    navigate('/cardpage');
                }, 3000);
            } finally {
                setLoading(false);
            }
        };

        fetchCardDetail();
    }, [cardId, navigate]);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Loading />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center h-screen">
                <div className="text-center">
                    <p className="text-red-500 mb-2">{error}</p>
                    <p className="text-[#757575] text-sm">잠시 후 카드 페이지로 돌아갑니다...</p>
                </div>
            </div>
        );
    }

    if (!card) {
        return null;
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

