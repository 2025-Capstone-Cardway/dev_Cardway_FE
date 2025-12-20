import UserInfo from "../components/mypage/UserInfo";
import MyWallet from "../components/mypage/MyWallet";
import Chart from "../components/mypage/Chart";

export default function MyPage() {
  return (
    <div className="flex-1 overflow-y-auto px-4">
      <UserInfo />
      <MyWallet />
      <Chart />
    </div>
  );
}
