import type { CardDetail } from '../mycard/types/Card';

interface CardDetailHeaderProps {
    card: CardDetail;
}

export default function CardDetailHeader({ card }: CardDetailHeaderProps) {
    return (
        <div className="flex flex-col items-center gap-4 px-4 pt-6">
            {card.image && (
                <img 
                    src={card.image}
                    alt={`${card.name} 카드 이미지`}
                    className="w-[120px] h-[185px] object-cover rounded-[10px] shadow-lg"
                />
            )}
            
            <div className="text-center mb-4" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                <h1 className="text-xl font-bold text-[#111143] mb-1">{card.name}</h1>
                <p className="text-sm text-[#757575]">{card.company}</p>
                {card.type && (
                    <span className="inline-block mt-2 px-3 py-1 bg-gray-50 border border-[#D9D9D9] rounded-full text-xs text-[#757575]">
                        {card.type}
                    </span>
                )}
            </div>
        </div>
    );
}

