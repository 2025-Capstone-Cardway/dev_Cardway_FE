import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/auth';
import defaultProfile from '../../assets/user/default_profile.png';

export default function UserInfo() {
  const navigate = useNavigate();
  const { user, provider, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // 로딩 중이거나 사용자 정보가 없는 경우
  if (!user) {
    return (
      <div className="w-full px-8 pt-16 pb-6 bg-white">
        <div className="flex items-center justify-center">
          <p className="text-gray-500">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-8 pt-16 pb-6 bg-white">
      <div className="flex items-center gap-4">
        {/* 프로필 이미지 */}
        <div className="shrink-0">
          <img 
            src={user.profileImageUrl || defaultProfile} 
            alt={user.nickname}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
            onError={(e) => {
              // 이미지 로드 실패 시 기본 이미지 표시
              e.currentTarget.src = defaultProfile;
            }}
          />
        </div>
        
        {/* 사용자 정보 */}
        <div className="flex-1">
          <h2 className="text-lg font-bold text-text-main">
            {user.nickname}
          </h2>
          {provider && (
            <p className="text-sm text-gray-500 mt-1">
              {provider === 'kakao' ? '카카오' : '네이버'} 로그인
            </p>
          )}
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

