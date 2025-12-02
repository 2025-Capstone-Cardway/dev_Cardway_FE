import kakao_login from "../../assets/login/kakao_login.png";


const KakaoLoginButton = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
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