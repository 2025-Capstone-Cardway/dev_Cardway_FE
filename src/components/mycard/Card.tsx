import type { Card,Benefit } from './types/Card';

interface CardProps {
  card: Card;
}


export default function CardView({ card }: CardProps) {
    const {image, name, company, benefit,isMainCard} = card;

    const containerClasses = isMainCard
      ? "border-2 border-orange-main shadow-lg"
      : "border border-gray-200 shadow-md";
    return(
      <div 
      className={`bg-white rounded-2xl p-4 flex items-start gap-4 w-full overflow-hidden shadow-md ${containerClasses}`}>
        {image&& (
          <img src ={image} alt={`${name}카드이미지`} className='w-[90px] h-[139px] object-cover rounded-lg flex-shrink-0'></img>
        )}
        <div className="flex flex-col flex-grow min-w-0">
          <div className="text-xl font-semibold text-text-main leading-normal mt-2 mb-2">
            {name}
          </div>
          <div className="text-base text-gray-500 mb-3">
            {company}
          </div>

          {benefit && benefit.length > 0 && (
            <div className="flex flex-wrap gap-2"> 
              {benefit.map((b, index) => (
                <span
                  key={index}
                  className="
                    px-3 py-1 text-sm font-medium 
                    text-gray-600 bg-gray-50 
                    border border-gray-300 rounded-full
                  "
                >
                  {b.category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
      
    );
}
