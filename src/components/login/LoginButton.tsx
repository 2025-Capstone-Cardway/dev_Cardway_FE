import axios from 'axios';
import kakao_login_medium_wide from "../../assets/login/kakao_login_medium_wide.png";


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
        <button onClick={handleLogin}>
            <img
                src={kakao_login_medium_wide}
                alt="카카오 로그인"
            />
        </button>
    )
}

export default KakaoLoginButton;