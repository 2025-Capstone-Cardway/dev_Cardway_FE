import { useEffect } from "react";
import useAuthStore from "../../store/auth";
import axios from "axios";

const AuthInitializer = () => {
  const { initializeAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("accessToken");
      
      if (token && !isInitialized) {
        try {
          // 회원정보조회 API 호출
          const response = await axios.get("/api/auth/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // API 응답 데이터 검증 및 인증 상태 초기화
          if (response.data) {
            initializeAuth(token, response.data);
          } else {
            console.error("회원정보 조회 실패: 응답 데이터가 없습니다");
            initializeAuth(token, undefined);
          }
        } catch (error) {
          console.error("토큰 검증 실패:", error);
          
          // axios 에러인지 확인
          if (axios.isAxiosError(error)) {
            // 401 Unauthorized 또는 403 Forbidden인 경우 토큰 제거
            if (error.response?.status === 401 || error.response?.status === 403) {
              localStorage.removeItem("accessToken");
              initializeAuth(token, undefined);
            } else {
              // 네트워크 에러 등 다른 에러는 토큰 유지하고 초기화만 완료
              initializeAuth(token, undefined);
            }
          } else {
            // axios 에러가 아닌 경우
            initializeAuth(token, undefined);
          }
        }
      }
    };

    initAuth();
  }, [initializeAuth, isInitialized]);

  return null;
};

export default AuthInitializer;
