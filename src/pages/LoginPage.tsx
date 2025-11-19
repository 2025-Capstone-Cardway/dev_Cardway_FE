import React from "react";
import KakaoLoginButton from "../components/login/KakaoLoginButton";
import NaverLoginButton from "../components/login/NaverLoginButton";
import logoImage from "../assets/login/logo.png";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pb-20">
      
      <div className="mb-16">
        <img 
          src={logoImage} 
          alt="서비스 로고" 
          className="w-40 h-auto" 
        />
      </div>
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
}
