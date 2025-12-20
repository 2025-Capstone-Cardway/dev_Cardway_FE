import type { Benefit } from "../mycard/types/Card";
import BenefitItem from "./BenefitItem";

interface BenefitListProps {
  benefits?: Benefit[];
}

export default function BenefitList({ benefits }: BenefitListProps) {
  if (!benefits || benefits.length === 0) {
    return null;
  }

  return (
    <div className="px-12 pb-20 ">
      <div
        className="space-y-6"
        style={{ fontFamily: "Noto Sans KR, sans-serif" }}
      >
        {benefits.map((benefit, index) => (
          <BenefitItem
            key={index}
            benefit={benefit}
            showDivider={index < benefits.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
