import type { Benefit } from '../mycard/types/Card';

interface BenefitItemProps {
    benefit: Benefit;
    showDivider: boolean;
}

export default function BenefitItem({ benefit, showDivider }: BenefitItemProps) {
    return (
        <div>
            <div className="space-y-4 py-5">
                <h2 className="text-lg font-bold text-black">{benefit.category}</h2>

                <div className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                    <span className="text-sm text-black">
                        {benefit.title}
                        {benefit.comment && ` ${benefit.comment}`}
                    </span>
                </div>

                {benefit.parterName && benefit.parterName.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                        {benefit.parterName.map((partner, idx) => (
                            <span
                                key={idx}
                                className="inline-block px-3 py-1 bg-gray-50 border border-[#D9D9D9] rounded-full text-xs text-[#757575]"
                            >
                                {partner}
                            </span>
                        ))}
                    </div>
                )}
            </div>
            {showDivider && <div className="border-b border-gray-200"></div>}
        </div>
    );
}

