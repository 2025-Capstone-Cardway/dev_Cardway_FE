import { create } from "zustand";

interface Position {
  lat: number;
  long: number;
}

interface PositionStore {
  position: Position;
  setPosition: (newLat: number, newLong: number) => void;
}
const usePositionStore = create<PositionStore>((set) => ({
  position: { lat: 0, long: 0 },
  setPosition: (newLat, newLong) =>
    set(() => ({
      position: { lat: newLat, long: newLong },
    })),
}));

export default usePositionStore;
