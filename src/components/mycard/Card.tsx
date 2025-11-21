import type { Card,Benefit } from './types/Card';

interface CardProps {
  card: Card;
}


export default function CardView({ card }: CardProps) {
    const {image, name, company, benefit,isMainCard} = card;

    const containerClasses = isMainCard
      ? "border-4 border-orange-main shadow-lg"
      : "border border-gray-200 shadow-md";
    return(
      <div 
      className={`bg-white rounded-xl p-4 mt-3 mx-2 flex flex-col gap-3 ${containerClasses}`}
      >
        <div className="flex items-center gap-4">
          <div className="text-lg font-semibold text-text-main">{name}</div>
          <div className="text-sm text-gray-500">{company}</div>
        </div>
      </div>
      
    );
}

//카드 benefit에서 카테고리만 추출
