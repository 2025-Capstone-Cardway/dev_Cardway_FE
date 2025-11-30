import StoreCard from "./StoreCard";
import axios from "axios";
import { useEffect, useState } from "react";
import usePositionStore from "../../store/position";
import Loading from "../common/Loading";

export interface Store {
  partnerId: number | null;
  partnerName: string;
  partnerImageUrl: string | null;
  categoryName: string | null;
  position: { x: string; y: string; distance: number };
  addressName: string;
  benefit: string;
}
interface Props {
  isOpened: boolean;
}

export default function StoreList({ isOpened }: Props) {
  const { position } = usePositionStore();
  const [stores, setStores] = useState<Store[]>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!position.lat || !position.long) return;
    const fetchBenefits = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/api/auth/partners?x=${
            position.long
          }&y=${position.lat}`,
          {
            headers: {
              Authorization: `Bearer ${import.meta.env.VITE_TEMP_TOKEN}`,
            },
          }
        );
        console.log("혜택 조회 결과:", res.data);
        setLoading(false);
        setStores(res.data);
        console.log("s", stores);
      } catch (err) {
        console.error("Error fetching card benefits:", err);
      }
    };

    fetchBenefits();
  }, [position]);

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading />
      </div>
    );
  }

  if (!stores || stores.length === 0) {
    return (
      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
        주변에 혜택을 받을 수 있는 가맹점이 없어요 🥲
      </div>
    );
  }
  return (
    <div className="flex flex-col overflow-hidden">
      <StoreCard store={stores?.[0]} />
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
        {stores?.slice(1)?.map((store) => (
          <StoreCard key={store.partnerName} store={store} />
        ))}
      </div>
    </div>
  );
}
