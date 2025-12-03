import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import axios from "axios";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token");

      if (token) {
        try {
          // 토큰으로 사용자 정보 가져오기
          const response = await axios.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          // localStorage와 zustand store 업데이트
          localStorage.setItem("accessToken", token);
          
          // API 응답 데이터 검증
          if (response.data) {
            initializeAuth(token, response.data);
          } else {
            console.error("회원정보 조회 실패: 응답 데이터가 없습니다");
            initializeAuth(token, undefined);
          }
          
          navigate("/", { replace: true });
        } catch (error) {
          console.error("사용자 정보 가져오기 실패:", error);
          
          // axios 에러인지 확인
          if (axios.isAxiosError(error)) {
            // 401 Unauthorized 또는 403 Forbidden인 경우 로그인 페이지로 이동
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem("accessToken");
              navigate("/login", { replace: true });
            } else {
              // 네트워크 에러 등 다른 에러는 토큰 저장하고 메인으로 이동
              localStorage.setItem("accessToken", token);
              initializeAuth(token, undefined);
              navigate("/", { replace: true });
            }
          } else {
            // axios 에러가 아닌 경우
            localStorage.setItem("accessToken", token);
            initializeAuth(token, undefined);
            navigate("/", { replace: true });
          }
        }
      } else {
        console.error("Login Fail : 토큰이 URL에 없습니다");
        navigate("/login", { replace: true });
      }
    };

    handleCallback();
  }, [location, navigate, initializeAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">로그인 처리 중...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
