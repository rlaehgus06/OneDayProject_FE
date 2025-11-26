import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import knuLogo from '../assets/knu_logo.png'; 
// joluvLogo import 제거
import { useAuth } from '../contexts/AuthContext'; 

const Header: React.FC = () => {
  const { isLoggedIn, logout } = useAuth(); 
  // useNavigate는 현재 사용되지 않지만 필요시 주석 해제하여 사용 가능
  // const navigate = useNavigate(); 

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
      
      <Link to="/" className="flex items-center space-x-3">
        <img src={knuLogo} alt="경북대학교 로고" className="h-8 w-auto" />
        {/* joluvLogo 이미지 제거하고 텍스트로 변경 */}
        <span className="text-2xl font-bold text-pink-500">JOLUV</span>
      </Link>

      <nav className="flex items-center space-x-8">
        <Link to="/score-management" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          수강과목정리
        </Link>
        <Link to="/checklist" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          졸업요건 CheckList
        </Link>
        <Link to="/summary" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          학점관리
        </Link>
        
        {/* 👇 로그인 상태일 때만 '마이페이지' 링크 표시 */}
        {isLoggedIn && (
          <Link 
            to="/mypage" 
            className="text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            마이페이지
          </Link>
        )}

        {/* 로그인 상태에 따라 버튼 다르게 표시 */}
        {isLoggedIn ? (
          <button 
            onClick={logout} 
            className="text-gray-700 font-semibold hover:text-blue-600 transition"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-gray-700 font-semibold hover:text-blue-600 transition">
            Login
          </Link>
        )}
      </nav>
    </header>
  );
};

export default Header;