import axios from 'axios';
import naver_login from "../../assets/login/naver_login.png";


const NaverLoginButton = () => {
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
        <button onClick={handleLogin} className="flex items-center justify-center h-12 rounded-lg bg-[#03C75A] hover:brightness-110 transition">
            <img
                src={naver_login}
                alt="네이버 로그인"
                className='w-full h-full object-contain'
            />
        </button>
    )
}

export default NaverLoginButton;
