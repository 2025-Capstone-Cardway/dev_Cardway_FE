import backIcon from "../../assets/back.png";
import { useNavigate } from "react-router-dom";

export default function BackIcon() {
  const navigate = useNavigate();
  const moveToBack = () => {
    navigate(-1);
  };
  return (
    <div
      className="w-full h-5 flex flex-row items-start"
      onClick={() => moveToBack()}
    >
      <img src={backIcon} className="w-5 h-5 " />
    </div>
  );
}
