import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import type { Card } from '../mycard/types/Card';
import basicCardImage from '../../assets/card/basiccard.png';
import useCardNavigation from '../../hooks/useCardNavigation';
import { getMyCards } from '../../api/card';

export default function MyWallet() {
    const [cards, setCards] = useState<Card[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const navigateToCard = useCardNavigation();

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

    return (
        <div className="w-full py-6 bg-white">
        <div className="px-8">
            <h2 className="text-md font-bold text-text-main mb-4">내 지갑</h2>
        </div>
        
        {/* 카드 리스트 (가로 스크롤)*/}
        <div className="px-8">
            {loading ? (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    <p className="ml-3 text-gray-500">카드를 불러오는 중...</p>
                </div>
            ) : cards.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                    <p className="text-gray-500">등록된 카드가 없습니다.</p>
                </div>
            ) : (
            <div className="overflow-x-auto overflow-y-visible scrollbar-hide -mx-2">
            <div className="flex gap-4 px-2 py-3">
                {cards.map((card, index) => (
                <motion.div 
                    key={card.id} 
                    className="shrink-0 cursor-pointer"
                    onClick={() => navigateToCard(card.id)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                    duration: 0.3,
                    delay: index * 0.1,
                    ease: "easeOut"
                    }}
                    whileHover={{ 
                    y: -8,
                    transition: { duration: 0.2 }
                    }}
                    whileTap={{ scale: 0.98 }}
                >
                    {/* 카드 이미지 */}
                    <motion.div 
                    className="w-24 h-36 rounded-xl overflow-hidden shadow-md"
                    whileHover={{
                        boxShadow: "0 10px 25px rgba(0, 0, 0, 0.15)"
                    }}
                    >
                    <img 
                        src={card.image} 
                        alt={card.name}
                        className="w-full h-full object-cover"
                    />
                    </motion.div>
                    
                    {/* 카드 정보 */}
                    <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-text-main truncate w-24">
                        {card.name}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                        {card.company}
                    </p>
                    </div>
                </motion.div>
                ))}
            </div>
            </div>
            )}
        </div>
        </div>
    );
}

