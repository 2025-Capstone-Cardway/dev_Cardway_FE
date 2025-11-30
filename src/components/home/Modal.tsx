import { useState, useRef } from "react";
import type { TouchEvent } from "react";
import StoreList from "./StoreList";

export default function Modal() {
  const [height, setHeight] = useState<number>(40);
  const [isSliding, setIsSliding] = useState<boolean>(false);
  const [isOpened, setIsOpened] = useState<boolean>(false);
  const startY = useRef<number | null>(null);
  const startHeight = useRef<number>(40);
  const [mode, setMode] = useState<number>(1); // 1:위치별, 2: 매장별

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsSliding(true);
    startY.current = e.touches[0].clientY;
    startHeight.current = height;
  };
  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isSliding || startY.current == null) return;
    const dy = startY.current - e.touches[0].clientY;
    const newHeight = Math.min(Math.max(startHeight.current + dy / 5, 40), 80);
    setHeight(newHeight);
    setIsOpened(true);
  };
  const handleTouchEnd = () => {
    setIsSliding(false);
    if (height > 40) setHeight(80);
    else {
      setHeight(40);
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
      </div>{" "}
      <div className="w-full flex flex-row justify-end px-5">
        <span onClick={() => setMode(1)}>위치별</span>{" "}
        <span className="px-2"> | </span>
        <span onClick={() => setMode(2)}>매장별</span>
      </div>
      <div className="w-full flex flex-col items-start px-8">
        <div className="text-orange-main font-bold">메인 카드</div>
        <div className="text-gray-400">으로 혜택을 받을 수 있어요</div>
      </div>
      <div className="w-full h-full px-5 mb-24 overflow-y-auto">
        <StoreList isOpened={isOpened} />
      </div>
    </div>
  );
}
