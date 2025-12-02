import naver_login from "../../assets/login/naver_login.png";


const NaverLoginButton = () => {
    const handleLogin = () => {
        window.location.href = "http://localhost:8080/oauth2/authorization/naver";
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
