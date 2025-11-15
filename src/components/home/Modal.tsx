import { useState, useRef } from "react";
import type { TouchEvent } from "react";
import StoreList from "./StoreList";

export default function Modal() {
  const [height, setHeight] = useState<number>(35);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(35);

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsSliding(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isSliding || startY.current == null) return;
    const dy = startY.current - e.touches[0].clientY;
    const newHeight = Math.min(Math.max(startHeight.current + dy / 5, 35), 80);
    setHeight(newHeight);
    setIsOpened(true);
  };
  const handleTouchEnd = () => {
    setIsSliding(false);
    if (height > 40) setHeight(80);
    else {
      setHeight(35);
      setIsOpened(false);
    }
  };

  return (
    <div
      className="absolute w-full bottom-0 left-0 z-30 flex flex-col items-center bg-white rounded-t-3xl shadow-lg border border-border-main transition-all duration-500 ease-out"
      style={{
        height: `${height}dvh`,
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className="w-full flex justify-center items-center py-3 cursor-grab">
        <div className="w-12 h-1.5 bg-border-main rounded-full" />
      </div>

      <div className="w-full h-full px-5 mb-20">
        <StoreList isOpened={isOpened} />
      </div>
    </div>
  );
}
