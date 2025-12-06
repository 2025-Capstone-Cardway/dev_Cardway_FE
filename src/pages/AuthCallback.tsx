import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";
import axios from "axios";
import apiClient from "../api/axios";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { initializeAuth } = useAuthStore();

  useEffect(() => {
    const handleCallback = async () => {
      const searchParams = new URLSearchParams(location.search);
      const token = searchParams.get("token"); // 백엔드에서 전달한 JWT 토큰
      const code = searchParams.get("code"); 
      const error = searchParams.get("error");

      // OAuth 에러 처리
      if (error) {
        console.error("OAuth 로그인 실패:", error);
        navigate("/login", { replace: true });
        return;
      }

      // JWT 토큰에서 사용자 ID 추출 유틸리티
      const decodeJwtToken = (token: string): { userId: string | null } => {
        try {
          const payload = token.split('.')[1];
          if (!payload) return { userId: null };
          
          const decodedPayload = JSON.parse(atob(payload));
          
          return { userId: decodedPayload.sub || null };
        } catch (error) {
          console.error("JWT 토큰 디코딩 실패:", error);
          return { userId: null };
        }
      };

      if (token) {
        try {
          // JWT 토큰에서 사용자 ID 추출
          const { userId } = decodeJwtToken(token);
          
          // 토큰 저장
          localStorage.setItem("accessToken", token);
          
          try {
            const profileResponse = await apiClient.get("/api/auth/profile");
            
            const profileData = profileResponse.data?.data || profileResponse.data;
            
            const userData = {
              id: userId || profileData.userId?.toString() || "",
              nickname: profileData.nickname || "",
              profileImageUrl: profileData.profileImageUrl || profileData.profileImage || undefined,
              email: profileData.email,
            };
            
            const provider = profileData.provider?.toLowerCase() === "naver" 
              ? "naver" 
              : (profileData.provider?.toLowerCase() === "kakao" ? "kakao" : "kakao");
            
            // 사용자 정보 초기화
            initializeAuth(
              token,
              "", // refreshToken 없음
              userData,
              provider
            );
          } catch (profileError) {
            // 회원정보조회 api.. 
            console.warn("회원정보조회 실패:", profileError);
            
            // 토큰만 저장하고 기본값으로 초기화
            initializeAuth(
              token,
              "", // refreshToken 없음
              {
                id: userId || "",
                nickname: "",
              },
              "kakao" // 임시값
            );
          }

          navigate("/", { replace: true });
        } catch (error) {
          console.error("토큰 저장 실패:", error);
          navigate("/login", { replace: true });
        }
        return;
      }

      if (code) {
        try {
          const response = await axios.post(
            `${import.meta.env.VITE_API_BASE_URL}/api/login/callback?code=${code}`,
            {},
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const { status, accessToken, refreshToken, user, provider } = response.data;

          // 성공 응답 검증
          if (status === "success" && accessToken && refreshToken && user) {
            const userData = {
              id: user.id,
              nickname: user.nickname,
              email: user.email,
            };

            // 인증 정보 초기화
            initializeAuth(
              accessToken,
              refreshToken,
              userData,
              provider === "kakao" ? "kakao" : "naver"
            );

            navigate("/", { replace: true });
          } else {
            console.error("로그인 응답 데이터가 올바르지 않습니다:", response.data);
            navigate("/login", { replace: true });
          }
        } catch (error) {
          console.error("로그인 콜백 처리 실패:", error);
          
          // axios 에러인지 확인
          if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const errorMessage = error.response?.data?.message || "로그인에 실패했습니다";

            // 401, 403 에러 처리
            if (status === 401 || status === 403) {
              console.error("인증 실패:", errorMessage);
              navigate("/login", { replace: true });
            } else if (status === 400) {
              console.error("잘못된 요청:", errorMessage);
              navigate("/login", { replace: true });
            } else {
              // 네트워크 에러 등
              alert("로그인 중 오류가 발생했습니다. 다시 시도해주세요.");
              navigate("/login", { replace: true });
            }
          } else {
            alert("로그인 중 알 수 없는 오류가 발생했습니다.");
            navigate("/login", { replace: true });
          }
        }
        return;
      }

      console.error("Login Fail: OAuth token 또는 code가 URL에 없습니다");
      console.log("현재 URL:", location.search);
      navigate("/login", { replace: true });
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
