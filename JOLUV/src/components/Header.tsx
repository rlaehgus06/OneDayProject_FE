import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import knuLogo from '../assets/knu_logo.png'; 
import { useAuth } from '../contexts/AuthContext'; // 👈 로그인 상태 사용을 위해 import

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth(); // 로그인 상태와 로그아웃 함수 가져오기
  const navigate = useNavigate();

  // 로그아웃 핸들러
  const handleLogout = () => {
    logout(); // 전역 상태에서 로그아웃 처리 (토큰 삭제 등)
    navigate('/'); // 메인 페이지로 이동
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
      
      {/* 로고 영역 (이미지 + 텍스트) */}
      <Link to="/" className="flex items-center space-x-3">
        <img src={knuLogo} alt="경북대학교 로고" className="h-8 w-auto" />
        <span className="text-2xl font-bold text-pink-500">JOLUV</span>
      </Link>

      {/* 네비게이션 링크 영역 */}
      <nav className="flex items-center space-x-8">
        <Link to="/score-management" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          수강과목정리
        </Link>
        <Link to="/checklist" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          졸업요건 Check
        </Link>
        <Link to="/summary" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          학점관리
        </Link>
        
        {/* 👇 로그인 상태에 따른 버튼 변경 로직 */}
        {isLoggedIn ? (
          // 로그인 상태일 때: 마이페이지 & 로그아웃 버튼 표시
          <div className="flex items-center space-x-8">
            <Link 
              to="/mypage" 
              className="text-gray-700 font-semibold hover:text-blue-600 transition"
            >
              마이페이지
            </Link>
            <button 
              onClick={handleLogout} 
              className="text-gray-700 font-semibold hover:text-blue-600 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          // 로그인 안 된 상태일 때: Login 버튼 표시
          <Link 
            to="/login" 
            className="text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;