import React from "react";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../store/auth";

const AuthCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);

    const token = searchParams.get("token");

    if (token) {
      localStorage.setItem("accessToken", token);
      navigate("/", { replace: true });
    } else {
      console.error("Login Fail : 토큰이 URL에 없습니다");
      navigate("/login", { replace: true });
    }
  }, [location, navigate]);

  return <div>로그인 처리 중</div>;
};

export default AuthCallback;
