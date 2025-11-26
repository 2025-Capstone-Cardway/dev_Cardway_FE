import React from "react";
import KakaoLoginButton from "../components/login/KakaoLoginButton";
import NaverLoginButton from "../components/login/NaverLoginButton";
import AnimatedLogo from "../components/login/AnimatedLogo";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 pb-20">
      
      <div className="mb-16">
        <AnimatedLogo />
      </div>
      <div className="flex flex-col gap-3 w-full max-w-[320px]">
        <KakaoLoginButton />
        <NaverLoginButton />
      </div>
    </div>
  );
}
