import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;             // API: userId
  nickname: string;       // API: nickname
  profileImageUrl?: string; // API: profileImage (명세) 또는 profileImageUrl (예시)
  email?: string;         // API: user.email (로그인 응답에만)
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  provider: 'kakao' | 'naver' | null;
  token: string | null;
  refreshToken: string | null;
  isInitialized: boolean;

  setToken: (token: string, refreshToken?: string) => void; 
  setUser: (userData: User, provider?: 'kakao' | 'naver') => void;
  initializeAuth: (token: string, refreshToken: string, userData: User, provider: 'kakao' | 'naver') => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      provider: null,
      token: null,
      refreshToken: null,
      isInitialized: false,

      setToken: (token, refreshToken) => {
        localStorage.setItem("accessToken", token);
        if (refreshToken) {
          localStorage.setItem("refreshToken", refreshToken);
        }
        set({
          isLoggedIn: true,
          token: token,
          refreshToken: refreshToken || get().refreshToken,
        });
      },
        
      setUser: (userData, provider) => {
        set({
          user: userData,
          provider: provider || get().provider,
        });
      },

      initializeAuth: (token, refreshToken, userData, provider) => {
        // userData 검증: 필수 필드가 모두 있는지 확인
        const validUserData = userData && 
          typeof userData.id === 'string' &&
          typeof userData.nickname === 'string'
          ? userData 
          : null;

        localStorage.setItem("accessToken", token);
        localStorage.setItem("refreshToken", refreshToken);

        set({
          isLoggedIn: true,
          token: token,
          refreshToken: refreshToken,
          user: validUserData,
          provider: provider,
          isInitialized: true,
        });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          isLoggedIn: false,
          user: null,
          provider: null,
          token: null,
          refreshToken: null,
          isInitialized: false, // 초기화 상태도 리셋
        });
      },

      checkAuth: () => {
        const state = get();
        const token = localStorage.getItem("accessToken");
        return !!(state.isLoggedIn && (state.token || token));
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        user: state.user,
        provider: state.provider,
        token: state.token,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

export default useAuthStore;