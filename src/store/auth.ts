import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  userId: number;          // API: userId
  provider: 'kakao' | 'naver';  // API: provider
  nickname: string;        // API: nickname
  profileImageUrl: string; // API: profileImageUrl
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;
  isInitialized: boolean;

  setToken: (token: string) => void; 
  setUser: (userData: User) => void;
  initializeAuth: (token: string, userData?: User) => void;
  logout: () => void;
  checkAuth: () => boolean;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isLoggedIn: false,
      user: null,
      token: null,
      isInitialized: false,

      setToken: (token) => {
        localStorage.setItem("accessToken", token);
        set({
          isLoggedIn: true,
          token: token,
        });
      },
        
      setUser: (userData) => 
        set({
          user: userData,
        }),

      initializeAuth: (token, userData) => {
        // userData 검증: 필수 필드가 모두 있는지 확인
        const validUserData = userData && 
          typeof userData.userId === 'number' &&
          typeof userData.provider === 'string' &&
          typeof userData.nickname === 'string' &&
          typeof userData.profileImageUrl === 'string'
          ? userData 
          : null;

        set({
          isLoggedIn: true,
          token: token,
          user: validUserData,
          isInitialized: true,
        });
      },

      logout: () => {
        localStorage.removeItem("accessToken");
        set({
          isLoggedIn: false,
          user: null,
          token: null,
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
        token: state.token,
      }),
    }
  )
);

export default useAuthStore;