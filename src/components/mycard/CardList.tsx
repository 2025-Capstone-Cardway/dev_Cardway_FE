import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type{Card } from './types/Card';
import CardView from './Card';
import AddCardButton from './AddCardButton';
import { getMyCards } from '../../api/card';
import Loading from '../common/Loading';

export default function CardList(){
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        const fetchCards = async () => {
            try {
                setLoading(true);
                const fetchedCards = await getMyCards();
                setCards(fetchedCards);
            } catch (error) {
                console.error('카드 목록 조회 실패:', error);
                // 에러 발생 시 빈 배열 유지
                setCards([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCards();
    }, []);

    const handleToggleMainCard = (cardId: number) => {
        setCards(prevCards => 
            prevCards.map(card => ({
                ...card,
                isMainCard: card.id === cardId
            }))
        );
    };

    const sortedCards = [...cards].sort((a, b) => {
        if (a.isMainCard && !b.isMainCard) return -1;
        if (!a.isMainCard && b.isMainCard) return 1;
        return 0;
    });

    if (loading) {
        return (
            <div className="w-full px-4 max-w-[480px] mx-auto space-y-3">
                <AddCardButton />
                <div className="flex flex-col items-center justify-center py-20">
                    <Loading />
                    <p className="text-gray-500 mt-4">카드를 불러오는 중...</p>
                </div>
            </div>
        );
    }

    return(
        <div className="w-full px-4 max-w-[480px] mx-auto space-y-3">
            <AddCardButton />
            {sortedCards.length === 0 ? (
                <div className="flex items-center justify-center py-20">
                    <p className="text-gray-500">등록된 카드가 없습니다.</p>
                </div>
            ) : (
                sortedCards.map((card, index) => (
                <motion.div
                    key={card.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                        layout: { 
                            type: "spring", 
                            stiffness: 300, 
                            damping: 30 
                        },
                        opacity: { duration: 0.2 }
                    }}
                    style={{ 
                        position: 'relative', 
                        zIndex: sortedCards.length - index,
                        isolation: 'isolate'
                    }}
                >
                    <CardView 
                        card={card}
                        onToggleMainCard={handleToggleMainCard}
                    />
                </motion.div>
                ))
            )}
        </div>
    );
}