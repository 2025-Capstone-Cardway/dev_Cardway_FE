import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import useAuthStore from '../store/auth';

// Axios 인스턴스 생성
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터: 모든 요청에 JWT 토큰 자동 추가
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('accessToken');
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터: 401 에러 시 로그아웃 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    // 401 에러 (Unauthorized): 토큰이 만료되었거나 유효하지 않음
    if (error.response?.status === 401) {
      // 로그아웃 처리
      useAuthStore.getState().logout();
      
      // 로그인 페이지로 리다이렉트 (현재 로그인 페이지가 아니면)
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    // 모든 에러는 그대로 반환
    return Promise.reject(error);
  }
);

export default apiClient;

