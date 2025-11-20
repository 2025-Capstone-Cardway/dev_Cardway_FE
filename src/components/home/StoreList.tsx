import StoreCard from "./StoreCard";

export interface Store {
  name: string;
  distance: string;
  address: string;
  benefit: string;
}
interface Props {
  isOpened: boolean;
}
const stores: Store[] = [
  {
    name: "CU 율전 농협사거리점",
    distance: "154m",
    address: "수원시 장안구 율전동",
    benefit: "10% 할인",
  },
  {
    name: "CGV",
    distance: "200m",
    address: "수원시 장안구 율전동",
    benefit: "1000원 할인",
  },
];

export default function StoreList({ isOpened }: Props) {
  return (
    <div className="flex flex-col overflow-hidden">
      <div className="text-orange-main font-bold">메인 카드</div>
      <div className="text-gray-400 mb-1">으로 혜택을 받을 수 있어요</div>

      <StoreCard store={stores[0]} />
      <div
        className={`
            transition-all duration-300 
            ${
              isOpened
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-2 pointer-events-none"
            }
          `}
      >
        {stores.slice(1).map((store) => (
          <StoreCard key={store.name} store={store} />
        ))}
      </div>
    </div>
  );
}
