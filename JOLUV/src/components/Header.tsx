import React from 'react';
import { Link } from 'react-router-dom'; // useNavigate 대신 Link만 사용합니다.

const Header: React.FC = () => {
  // handleLoginClick 함수는 <Link>로 대체되므로 삭제합니다.

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
      
      {/* 로고 영역 */}
      <Link to="/" className="flex items-center space-x-2">
        <span className="text-xl font-bold text-gray-700 whitespace-nowrap">
          경북대학교 | <span className="text-pink-400">JOLUV</span>
        </span>
      </Link>

      {/* 네비게이션 링크 영역 (새로 추가/수정됨) */}
      <nav className="flex items-center space-x-8">
        <Link to="/courses" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          수강과목정리
        </Link>
        <Link to="/checklist" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          졸업요건 CheckList
        </Link>
        <Link to="/summary" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          학점관리
        </Link>
        <Link to="/login" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;