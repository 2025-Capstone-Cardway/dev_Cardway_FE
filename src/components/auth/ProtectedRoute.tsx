import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../../store/auth";

const ProtectedRoute = () => {
  const { isLoggedIn, token } = useAuthStore();
  const localToken = localStorage.getItem("accessToken");

  // 로그인 상태 확인 (store의 상태 또는 localStorage의 토큰)
  const isAuthenticated = isLoggedIn || !!token || !!localToken;

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />;
  }

  // 로그인된 경우 자식 라우트 렌더링
  return <Outlet />;
};

export default ProtectedRoute;

