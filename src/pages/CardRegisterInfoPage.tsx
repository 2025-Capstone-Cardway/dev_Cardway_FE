import { useLocation, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Loading from "../components/common/Loading";

export default function CardRegisterInfoPage() {
  const { img, name, code, url } = useLocation().state.card;
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  // 토큰 수정
  const token: string = import.meta.env.VITE_TEMP_TOKEN;
  // 토큰 수정
  const handleSubmit = async () => {
    if (!id) {
      alert("ID를 입력하세요");
      return;
    } else if (!pw) {
      alert("PW를 입력하세요");
      return;
    }
    setLoading(true);
    try {
      const connectRes = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/codef/connect?cardCompanyCode=${code}`,
        {
          loginId: id,
          loginPw: pw,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(connectRes);
      const syncCardRes = await axios.post(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/api/codef/sync-cards?cardCompanyCode=${code}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(syncCardRes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
      navigate("/cardPage");
    }
  };
  return (
    <div className="w-full px-10 py-25 flex flex-col items-center gap-15">
      {loading && (
        <div className="fixed inset-0 flex justify-center items-center z-50">
          <Loading />
        </div>
      )}
      <div className="text-2xl text-text-main flex flex-col items-center">
        <img src={img} className="w-20 h-20 rounded-full mb-5"></img>
        <span className="text-orange-main font-bold">
          {name}
          <span className="text-text-main font-medium">의</span>
        </span>
        <span>회원 정보를 입력해주세요</span>
        <Link to={url}>
          {" "}
          <span className="text-gray-300 font-light text-sm">
            * 카드사 회원정보 확인하러 가기
          </span>
        </Link>
      </div>
      <div className="w-full flex flex-col items-center gap-5">
        <input
          placeholder="ID"
          className="px-10 focus:outline-orange-main w-full h-14 border border-border-main p-2 rounded-2xl bg-white"
          value={id}
          onChange={(e) => setId(e.target.value)}
        ></input>
        <input
          placeholder="PW"
          type="password"
          className="px-10 focus:outline-orange-main w-full h-14 border border-border-main p-2 rounded-2xl bg-white"
          value={pw}
          onChange={(e) => setPw(e.target.value)}
        ></input>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full border border-border-main text-xl rounded-3xl mt-10 text-text-main h-12 shadow cursor-pointer"
      >
        {name} 등록하기
      </button>
    </div>
  );
}
