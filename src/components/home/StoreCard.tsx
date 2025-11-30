import type { Store } from "./StoreList";

interface StoreCardProps {
  store: Store | null;
}

export default function StoreCard({ store }: StoreCardProps) {
  if (!store) return null;
  return (
    <div className="border border-border-main rounded-xl h-full px-4 p-3 mt-2 gap-2 flex flex-col">
      <div className="flex flex-row justify-between">
        {" "}
        <div className="text-text-main text-lg">{store.partnerName}</div>
        <div className="text-gray-400 text-sm">{store.position.distance}m</div>
      </div>

      <div className="text-gray-400 text-sm">{store.addressName}</div>
      <div className="text-text-sub text-md">{store.benefit}</div>
    </div>
  );
}
