import type { Store } from "./StoreList";

interface StoreCardProps {
  store: Store;
}

export default function StoreCard({ store }: StoreCardProps) {
  return (
    <div className="border border-border-main rounded-xl h-full mx-2 p-3 mt-2 gap-2 flex flex-col">
      <div className="text-text-main">{store.name}</div>
      <div className="text-gray-400 text-sm">{store.address}</div>
      <div className="text-text-sub">{store.benefit}</div>
    </div>
  );
}
