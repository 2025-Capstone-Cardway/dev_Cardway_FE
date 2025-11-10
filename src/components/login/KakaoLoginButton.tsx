import axios from 'axios';
import kakao_login from "../../assets/login/kakao_login.png";


const KakaoLoginButton = () => {
    const API_BASE_URL = "http://localhost:8080";
    
    const handleLogin = async () => {

        try{
            const response = await axios.get(`${API_BASE_URL}/api/auth/kakao/login`);

            const {redirectUrl} = response.data;

            window.location.href = redirectUrl;
        } catch (error){
            console.error("로그인 요청 실패: ",error);
        }
    };
    return (
        <button onClick={handleLogin} className="flex items-center justify-center h-12 rounded-lg bg-[#FEE500] hover:bg-[#FDD835] transition">
            <img
                src={kakao_login}
                alt="카카오 로그인"
                className='w-full h-full object-contain'
            />
        </button>
    )
}

export default KakaoLoginButton;