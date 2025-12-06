import { useEffect } from "react";
import useAuthStore from "../../store/auth";
import apiClient from "../../api/axios";

const AuthInitializer = () => {
  const { isInitialized, token, user } = useAuthStore();

  useEffect(() => {
    // 이미 초기화되었으면 건너뛰기
    if (isInitialized) {
      return;
    }

    const localToken = localStorage.getItem("accessToken");
    const localRefreshToken = localStorage.getItem("refreshToken");

    // 토큰이 있으면 Store 상태와 동기화
    if (localToken) {
      // Store에 사용자 정보가 없으면 (새로고침 등으로 Store 초기화된 경우)
      if (!user || !token) {
        // JWT 토큰에서 사용자 ID 추출
        const decodeJwtToken = (token: string): { userId: string | null } => {
          try {
            const payload = token.split('.')[1];
            if (!payload) return { userId: null };
            const decodedPayload = JSON.parse(atob(payload));
            return { userId: decodedPayload.sub || null };
          } catch {
            return { userId: null };
          }
        };

        const { userId } = decodeJwtToken(localToken);

        // 회원정보조회 API 호출 시도
        const fetchUserProfile = async () => {
          try {
            const response = await apiClient.get("/api/auth/profile");
            const profileData = response.data?.data || response.data;
            
            // API 명세에 맞게 사용자 정보 업데이트
            useAuthStore.getState().setUser({
              id: userId?.toString() || profileData.userId?.toString() || "",
              nickname: profileData.nickname || "",
              profileImageUrl: profileData.profileImageUrl || profileData.profileImage || undefined,
              email: profileData.email,
            }, profileData.provider?.toLowerCase() === "naver" ? "naver" : "kakao");
          } catch (error) {
            console.warn("회원정보조회 실패:", error);
          }
        };

        // Store 상태 설정
        useAuthStore.setState({
          isLoggedIn: true,
          token: localToken,
          refreshToken: localRefreshToken,
          isInitialized: true,
        });

        // 사용자 정보 조회 시도
        fetchUserProfile();
      } else {
        // Store에 이미 정보가 있으면 초기화만 완료
        useAuthStore.setState({ isInitialized: true });
      }
    } else {
      // 토큰이 없으면 초기화만 완료 (비로그인 상태)
      useAuthStore.setState({ isInitialized: true });
    }
  }, [isInitialized, token, user]);

  return null;
};

export default AuthInitializer;
