import { useState } from 'react';
import type { CardDetail } from '../mycard/types/Card';

interface CardDetailHeaderProps {
    card: CardDetail;
}

export default function CardDetailHeader({ card }: CardDetailHeaderProps) {
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

    return (
        <div className="flex flex-col items-center gap-4 px-4 pt-6">
            <div className="w-[120px] h-[185px] rounded-[10px] shadow-lg overflow-hidden flex items-center justify-center">
                {card.image && (
                    <img 
                        src={card.image}
                        alt={`${card.name} 카드 이미지`}
                        onLoad={handleImageLoad}
                        className={`object-contain max-w-full min-h-full ${
                            isLandscape ? "" : "rotate-90"
                        }`}
                    />
                )}
            </div>
            
            <div className="text-center mb-4" style={{ fontFamily: 'Noto Sans KR, sans-serif' }}>
                <h1 className="text-xl font-bold text-[#111143] mb-1">{card.name}</h1>
                <p className="text-sm text-[#757575]">{card.company}</p>
            </div>
        </div>
    );
}

