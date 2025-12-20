import { useMemo, useState, useEffect, useRef } from "react";
import type { ApexOptions } from "apexcharts";
import ReactApexChart from "react-apexcharts";
import { getCardTransactions } from "../../api/card";
import type { CardTransactionResponse } from "../../api/card";
import apiClient from "../../api/axios";

interface DateRange {
  start: string;
  end: string;
}

const CHART_COLORS = ["#f98513", "#bf681f", "#854b2c", "#4b2e38", "#111144"];

const formatDate = (date: Date) => date.toISOString().slice(0, 10);

const getDefaultRange = (): DateRange => {
  const endDate = new Date();
  const startDate = new Date(endDate);
  startDate.setMonth(endDate.getMonth() - 1);
  return { start: formatDate(startDate), end: formatDate(endDate) };
};

const aggregateTransactions = (transactions: CardTransactionResponse[]) => {
  const totals = transactions.reduce<Record<string, number>>((acc, tx) => {
    const label = tx.storeType || "기타";
    const amount = Number(tx.amount);
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
  const [dateRange, setDateRange] = useState<DateRange>(() =>
    getDefaultRange()
  );
  const [pendingRange, setPendingRange] = useState<DateRange>(() =>
    getDefaultRange()
  );
  console.log("data", dateRange, pendingRange);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [series, setSeries] = useState<number[]>([]);
  const [labels, setLabels] = useState<string[]>([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false); // 차트용
  const [syncing, setSyncing] = useState(false); // CODEF 연동용
  const [error, setError] = useState<string | null>(null);
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

  const fetchTransactions = async (range: DateRange) => {
    console.log("정보 불러옴");
    try {
      setLoading(true);
      setError(null);

      const transactions = await getCardTransactions(range.start, range.end);

      const aggregated = aggregateTransactions(transactions).filter(
        (item) => item.value > 0
      );

      setLabels(aggregated.map((item) => item.label));
      setSeries(aggregated.map((item) => item.value));
      setTotalAmount(aggregated.reduce((sum, item) => sum + item.value, 0));
    } catch (err) {
      console.error("승인 내역 조회 실패:", err);
      setError("승인 내역을 불러올 수 없습니다.");
      setLabels([]);
      setSeries([]);
      setTotalAmount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(dateRange);
  }, [dateRange.start, dateRange.end]);

  const handleRangeToggle = () => {
    setPendingRange(dateRange);
    setIsPickerOpen((prev) => !prev);
  };

  const handleDateChange = (field: keyof DateRange, value: string) => {
    setPendingRange((prev) => ({ ...prev, [field]: value }));
  };

  const isRangeFilled = Boolean(pendingRange.start && pendingRange.end);
  const isRangeInvalid = isRangeFilled && pendingRange.start > pendingRange.end;

  const applyRange = () => {
    if (!isRangeFilled || isRangeInvalid) return;
    setDateRange(pendingRange);
    setIsPickerOpen(false);
  };
  const getCodefConsume = async () => {
    try {
      setLoading(true);
      setError(null);

      const startDate = new Date(dateRange.start);
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1;

      await apiClient.post(`/api/codef/sync-transactions`, null, {
        params: {
          year,
          month,
        },
      });
    } catch (err) {
      console.error("소비 내역 동기화 실패:", err);
      setError("소비 내역 업데이트에 실패했습니다.");
    } finally {
      setSyncing(false);
      setLoading(false);
      fetchTransactions(dateRange);
    }
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
    <div className="w-full px-8 bg-white py-1 rounded-2xl  mt-3">
      <div className="flex flex-col gap-2 mb-1 relative">
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

      <div className="w-full flex flex-row items-center justify-between ">
        <span className="font-semibold text-text-main">
          {totalAmount.toLocaleString()}원
        </span>

        <button
          className="border rounded-2xl text-xs text-text-sub px-3"
          onClick={getCodefConsume}
        >
          {loading ? "업데이트 중..." : "내역 업데이트"}
        </button>
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
