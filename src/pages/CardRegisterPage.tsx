import bc from "../assets/brand/bc.gif";
import hana from "../assets/brand/hana.svg";
import hyundai from "../assets/brand/hyundai.png";
import kb from "../assets/brand/kb.svg";
import lotte from "../assets/brand/lotte.jpeg";
import nh from "../assets/brand/nh.svg";
import samsung from "../assets/brand/samsung.png";
import shinhan from "../assets/brand/shinhan.svg";
import woori from "../assets/brand/woori.svg";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
interface BrandItem {
  img: string;
  name: string;
  code: string;
  url: string;
}

const brandList: BrandItem[] = [
  {
    img: bc,
    name: "비씨카드",
    code: "0305",
    url: "https://m.bccard.com/app/mobileweb/index.do",
  },
  {
    img: hana,
    name: "하나카드",
    code: "0313",
    url: "https://m.hanacard.co.kr/MKMAIN1010M.web",
  },
  {
    img: hyundai,
    name: "현대카드",
    code: "0302",
    url: "https://www.hyundaicard.com/index.jsp",
  },
  {
    img: kb,
    name: "kb국민카드",
    code: "0301",
    url: "https://m.kbcard.com/CMN/DVIEW/MOAMCXHIAAMC0002",
  },
  {
    img: lotte,
    name: "롯데카드",
    code: "0311",
    url: "https://m.lottecard.co.kr/app/LPMAIAA_V100.lc",
  },
  {
    img: nh,
    name: "nh농협카드",
    code: "0304",
    url: "https://nhpay.nonghyup.com/",
  },
  {
    img: samsung,
    name: "삼성카드",
    code: "0303",
    url: "https://www.samsungcard.com/personal/main/UHPPCO0101M0.jsp",
  },
  {
    img: shinhan,
    name: "신한카드",
    code: "0306",
    url: "https://www.shinhancard.com/pconts/html/main.html",
  },
  {
    img: woori,
    name: "우리카드",
    code: "0309",
    url: "https://m.wooricard.com/dcmw/main.do",
  },
];

export default function CardRegisterPage() {
  const [card, setCard] = useState<BrandItem>({
    img: "",
    name: "",
    code: "",
    url: "",
  });

  const navigate = useNavigate();

  const token: string = import.meta.env.VITE_TEMP_TOKEN as string;
  const baseURL: string = import.meta.env.VITE_API_BASE_URL as string;

  const submit = async (): Promise<void> => {
    if (!card) {
      alert("카드를 선택하세요");
      return;
    }

    try {
      const res = await axios.get<{ data: boolean }>(
        `${baseURL}/api/codef/check-connected?cardCompanyCode=${card.code}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log(res.data.data);

      if (res.data.data === false) {
        navigate("/card/register/info", {
          state: { card },
        });
      } else {
        navigate("/cardPage");
      }
    } catch (error) {
      console.error("Axios Error:", error);
    }
  };

  return (
    <div className="w-full px-10 py-25 flex flex-col items-center">
      <h1 className="text-2xl pb-10 text-text-main">
        불러올 카드사를 선택하세요
      </h1>

      <div className="w-full grid grid-cols-3 justify-items-center gap-5">
        {brandList.map((b) => (
          <div
            key={b.code}
            onClick={() => {
              setCard({ img: b.img, name: b.name, code: b.code, url: b.url });
            }}
            className={`w-25 h-25 shadow rounded-2xl bg-gray-50 flex flex-col items-center justify-center gap-2 cursor-pointer
              ${card.code === b.code ? "border border-orange-main" : ""}`}
          >
            <img src={b.img} alt={b.name} className="w-10 h-10 rounded-full" />
            <div className="text-text-main">{b.name}</div>
          </div>
        ))}
      </div>

      <button
        onClick={submit}
        className="w-full border border-border-main text-xl rounded-3xl mt-10 text-text-main h-12 shadow cursor-pointer"
      >
        등록하기
      </button>
    </div>
  );
}
