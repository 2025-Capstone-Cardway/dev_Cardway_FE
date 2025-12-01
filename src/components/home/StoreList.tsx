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

export default function StoreList() {
  const { position } = usePositionStore();
  const [stores, setStores] = useState<Store[]>([]);
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

        setStores(res.data);
      } catch (err) {
        console.error("Error fetching card benefits:", err);
      } finally {
        setLoading(false);
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
    <div className="flex flex-col gap-3 pb-10">
      {stores.map((store) => (
        <StoreCard key={store.partnerName} store={store} />
      ))}
    </div>
  );
}
