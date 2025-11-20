import { create } from "zustand";

interface User {
  id: number;              // user_id
  socialId: number;        // social_id
  oauthProvider: 'kakao' | 'naver'; 
  nickname: string;
  profileImage: string;    // profile_image
  connectedId: string;     // connected_id 
}

interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
  token: string | null;

  setToken: (token: string) => void; 
  setUser: (userData: User) => void; 
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isLoggedIn: false,
  user: null,
  token: null,

  setToken: (token) => 
    set({
      isLoggedIn: true,
      token: token,
      user: null, 
    }),
    
  setUser: (userData) => 
    set({
      user: userData,
    }),

  logout: () =>
    set({
      isLoggedIn: false,
      user: null,
      token: null,
    }),
}));

export default useAuthStore;