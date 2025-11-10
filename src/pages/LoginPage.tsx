import React from "react";
import KakaoLoginButton from "../components/login/KakaoLoginButton";
import NaverLoginButton from "../components/login/NaverLoginButton";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>  
  );
}
