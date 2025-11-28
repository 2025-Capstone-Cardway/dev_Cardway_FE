import { useMemo, useState, useEffect, useRef } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";

interface DateRange {
  start: string;
  end: string;
}

interface Transaction {
  transactionId: number;
  approvedAt: string;
  amount: string | number;
  storeName: string;
  storeType: string;
}

const CHART_COLORS = [
  "#f98513",
  "#bf681f",
  "#854b2c",
  "#4b2e38",
  "#111144",
];

const MOCK_TRANSACTIONS: Transaction[] = [
  {
    transactionId: 15,
    approvedAt: "2025-10-31T11:49:38",
    amount: "3500",
    storeName: "지에스25 성대기숙사의점",
    storeType: "편의점",
  },
  {
    transactionId: 16,
    approvedAt: "2025-10-25T17:32:35",
    amount: "20300",
    storeName: "회기버거",
    storeType: "일반음식점",
  },
  {
    transactionId: 17,
    approvedAt: "2025-10-25T17:06:29",
    amount: "4000",
    storeName: "플랜비스튜디오 경희대점",
    storeType: "사진관.현상소",
  },
  {
    transactionId: 18,
    approvedAt: "2025-10-24T18:56:57",
    amount: "2200",
    storeName: "씨유 수원천천신원점",
    storeType: "편의점",
  },
];

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 1);
  return { start: formatDate(startDate), end: formatDate(endDate) };
};

const aggregateTransactions = (transactions: Transaction[]) => {
  const totals = transactions.reduce<Record<string, number>>((acc, tx) => {
    const label = tx.storeType || "기타";
    const amount = typeof tx.amount === "string" ? Number(tx.amount) : tx.amount;
    if (!Number.isFinite(amount)) return acc;

    acc[label] = (acc[label] ?? 0) + amount;
    return acc;
  }, {});

  return Object.entries(totals).map(([label, value]) => ({
    label,
    value,
  }));
};

export default function Chart() {
  const [dateRange, setDateRange] = useState<DateRange>(() => getDefaultRange());
  const [pendingRange, setPendingRange] = useState<DateRange>(() =>
    getDefaultRange()
  );
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const pickerRef = useRef<HTMLDivElement | null>(null);

  const chartOptions = useMemo<ApexOptions>(
    () => ({
      chart: {
        type: "donut",
        animations: { enabled: true },
      },
      colors: CHART_COLORS,
      states: {
        hover: {
          filter: { type: "none" },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: { type: "none" },
        },
      },
      plotOptions: {
        pie: {
          expandOnClick: false,
          donut: {
            size: "0%",
            labels: {
              show: false,
            },
          },
        },
      },
      labels,
      legend: {
        position: "bottom",
        fontSize: "12px",
        markers: {
          width: 10,
          height: 10,
          radius: 9999,
          fillColors: CHART_COLORS,
        },
        onItemHover: {
          highlightDataSeries: false,
        },
      },
      dataLabels: {
        formatter: (val) => {
          const percent =
            typeof val === "number" ? val.toFixed(1) : Number(val).toFixed(1);
          return `${percent}%`;
        },
        dropShadow: { enabled: false },
      },
      tooltip: {
        y: {
          formatter: (value: number) => `${value.toLocaleString()}원`,
        },
        fillSeriesColor: true,
      },
    }),
    [labels]
  );

  useEffect(() => {
    const filtered = MOCK_TRANSACTIONS.filter((tx) => {
      const date = tx.approvedAt.slice(0, 10);
      return date >= dateRange.start && date <= dateRange.end;
    });

    const aggregated = aggregateTransactions(filtered).filter(
      (item) => Number.isFinite(item.value) && item.value > 0
    );

    setLabels(aggregated.map((item) => item.label));
    setSeries(aggregated.map((item) => item.value));
    setTotalAmount(
      aggregated.reduce((sum, item) => sum + (item.value ?? 0), 0)
    );
  }, [dateRange.end, dateRange.start]);

  const handleRangeToggle = () => {
    setPendingRange(dateRange);
    setIsPickerOpen((prev) => !prev);
  };

  const handleDateChange = (field: keyof DateRange, value: string) => {
    setPendingRange((prev) => ({ ...prev, [field]: value }));
  };

  const isRangeFilled = Boolean(pendingRange.start && pendingRange.end);
  const isRangeInvalid =
    isRangeFilled && pendingRange.start > pendingRange.end;

  const applyRange = () => {
    if (!isRangeFilled || isRangeInvalid) return;
    setDateRange(pendingRange);
    setIsPickerOpen(false);
  };

  useEffect(() => {
    if (!isPickerOpen) return;
    const handleClickOutside = (event: MouseEvent) => {
      if (
        pickerRef.current &&
        !pickerRef.current.contains(event.target as Node)
      ) {
        setIsPickerOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPickerOpen]);

  return (
    <div className="w-full px-8 bg-white py-6 rounded-2xl">
      <div className="flex flex-col gap-2 mb-4 relative">
        <div className="flex items-center justify-between">
          <h2 className="text-md font-bold text-text-main">나의 소비내역</h2>
          <button
            onClick={handleRangeToggle}
            className="text-sm text-gray-500 hover:text-orange-main transition"
          >
            {dateRange.start} ~ {dateRange.end}
          </button>
        </div>
        {isPickerOpen && (
          <div
            ref={pickerRef}
            className="absolute right-0 top-full mt-2 bg-white border border-gray-200 rounded-xl shadow-lg p-4 w-72 z-10"
          >
            <div className="flex flex-col gap-3">
              <label className="text-xs text-gray-500">기간 선택</label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={pendingRange.start}
                  onChange={(e) => handleDateChange("start", e.target.value)}
                  className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:border-orange-main focus:outline-none"
                />
                <input
                  type="date"
                  value={pendingRange.end}
                  onChange={(e) => handleDateChange("end", e.target.value)}
                  className="flex-1 min-w-0 border border-gray-200 rounded-lg px-2 py-1.5 text-xs focus:border-orange-main focus:outline-none"
                />
              </div>
              {isRangeInvalid && (
                <p className="text-xs text-red-500">
                  시작일이 종료일보다 늦을 수 없습니다.
                </p>
              )}
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setIsPickerOpen(false)}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50"
                >
                  취소
                </button>
                <button
                  onClick={applyRange}
                  disabled={!isRangeFilled || isRangeInvalid}
                  className={`px-3 py-2 text-sm rounded-lg text-white ${
                    !isRangeFilled || isRangeInvalid
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-orange-main hover:bg-orange-500"
                  }`}
                >
                  적용
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="min-h-[340px] pt-4 flex flex-col items-center justify-center">
        {series.length > 0 ? (
          <>
            <ReactApexChart
              options={chartOptions}
              series={series}
              type="donut"
              height={320}
            />
            <p className="mt-4 pt-4 text-sm text-gray-600">
              총 소비 금액{" "}
              <span className="font-semibold text-text-main">
                {totalAmount.toLocaleString()}원
              </span>
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            선택한 기간에 대한 소비 내역이 없습니다.
          </p>
        )}
      </div>
    </div>
  );
}

