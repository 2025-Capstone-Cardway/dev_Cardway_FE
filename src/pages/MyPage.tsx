import UserInfo from "../components/mypage/UserInfo";
import MyWallet from "../components/mypage/MyWallet";
import Chart from "../components/mypage/Chart";

export default function MyPage() {
  return (
    <div>
      {/* 사용자 정보 */}
      <UserInfo />
      
      {/* 내 지갑 */}
      <MyWallet />
      
      {/* 나의 소비내역 */}
      <Chart />
    </div>
  );
}
