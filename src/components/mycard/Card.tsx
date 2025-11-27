import type { Card } from './types/Card';
import useCardNavigation from '../../hooks/useCardNavigation';

interface CardProps {
  card: Card;
  onToggleMainCard?: (cardId: number) => void;
}


export default function CardView({ card, onToggleMainCard }: CardProps) {
    const {id, image, name, company, benefit, isMainCard} = card;
    const navigateToCard = useCardNavigation();

    const containerClasses = isMainCard
      ? "border-2 border-orange-main shadow-lg"
      : "border border-gray-200 shadow-md";

    const handleCardClick = () => {
        navigateToCard(id);
    };

    return(
      <div 
        onClick={handleCardClick}
        className={`relative flex flex-row items-center gap-[20px] w-full h-[169px] p-[15px] pr-[15px] rounded-[10px] box-border bg-white cursor-pointer hover:shadow-xl transition-shadow ${containerClasses}`}
        style={{ fontFamily: 'Noto Sans KR, sans-serif' }}
      >
        {/* Card Image */}
        {image && (
          <img 
            src={image} 
            alt={`${name}카드이미지`} 
            className="w-[90px] h-[139px] object-cover flex-none"
          />
        )}
        
        {/* Content Container */}
        <div className="flex flex-col items-start gap-[10px] flex-1 min-w-0 h-[131px] pr-[30px]">
          {/* Card Name */}
          <div 
            className="w-full h-[19px] font-medium text-[16px] leading-[19px] text-black flex-none"
            style={{ fontFamily: 'Noto Sans KR' }}
          >
            {name}
          </div>
          
          {/* Company Name */}
          <div 
            className="w-full h-[15px] font-normal text-[12px] leading-[15px] text-[#757575] flex-none"
            style={{ fontFamily: 'Noto Sans KR' }}
          >
            {company}
          </div>

          {/* Tags Container */}
          {benefit && benefit.length > 0 && (
            <div className="flex flex-row flex-wrap items-start content-start gap-[5px] max-w-full flex-none">
              {benefit.map((b, index) => (
                <span
                  key={index}
                  className="relative bg-gray-50 border border-[#D9D9D9] rounded-[7px] px-[8px] py-1 flex-none inline-flex items-center"
                >
                  <span 
                    className="font-normal text-[10px] leading-[12px] text-[#757575]"
                    style={{ fontFamily: 'Noto Sans KR' }}
                  >
                    {b.category}
                  </span>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Star Button (main Card 설정 버튼) */}
        <button 
          className="absolute top-[15px] right-[15px] w-[20px] h-[20px] cursor-pointer hover:opacity-80 transition-opacity"
          onClick={(e) => {
            e.stopPropagation();
            onToggleMainCard?.(id);
          }}
          aria-label="메인카드로 설정"
        >
          {isMainCard ? (
            <svg 
              className="w-full h-full" 
              viewBox="0 0 20 20" 
              fill="#f98613"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 2L12.245 7.905L18 8.5L14 12.755L15.49 18L10 15.245L4.51 18L6 12.755L2 8.5L7.755 7.905L10 2Z" 
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          ) : (
            <svg 
              className="w-full h-full" 
              viewBox="0 0 20 20" 
              fill="none"
              stroke="#E8E8ED"
              strokeWidth="1"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                d="M10 2L12.245 7.905L18 8.5L14 12.755L15.49 18L10 15.245L4.51 18L6 12.755L2 8.5L7.755 7.905L10 2Z" 
                strokeLinejoin="round"
                strokeLinecap="round"
              />
            </svg>
          )}
        </button>
      </div>
    );
}
