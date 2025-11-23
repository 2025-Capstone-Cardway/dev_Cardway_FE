import { useState } from 'react';

// API 응답 타입 정의
interface UserProfile {
  userId: number;
  provider: 'kakao' | 'naver';
  nickname: string;
  profileImage: string;
}

// Mock 데이터 - 나중에 API로 교체
const mockUserProfile: UserProfile = {
  userId: 1,
  provider: 'kakao',
  nickname: 'User1',
  profileImage: ''
};

export default function UserInfo() {
  const [userProfile] = useState<UserProfile>(mockUserProfile);

  const handleLogout = () => {
    // 로그아웃 로직 추가
    console.log('로그아웃');
  };

  return (
    <div className="w-full px-8 pt-16 pb-6 bg-white">
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          <img 
            src={userProfile.profileImage} 
            alt={userProfile.nickname}
            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
          />
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-text-main">
            {userProfile.nickname}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {userProfile.provider === 'kakao' ? '카카오' : '네이버'} 로그인
          </p>
        </div>
        
        {/* 로그아웃 버튼 */}
        <button 
          onClick={handleLogout}
          className="px-5 py-1.5 bg-white text-[#111143] text-sm rounded-[28px] border border-[rgba(17,17,67,0.1)] hover:bg-gray-50 active:bg-gray-100 transition-all duration-200"
          style={{
            boxShadow: '1px 1px 2px rgba(0, 0, 0, 0.1), -1px -1px 2px rgba(0, 0, 0, 0.1)',
            fontFamily: 'Noto Sans KR, sans-serif'
          }}
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}

