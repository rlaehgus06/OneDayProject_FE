import React from 'react';
import { Link } from 'react-router-dom';
// 👇 1. 이미지 파일을 import 합니다. (파일 경로는 실제 위치에 맞게 수정해주세요)
import knuLogo from '../assets/knu_logo.png'; 

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center fixed top-0 w-full z-50">
      
      {/* 로고 영역 수정 */}
      <Link to="/" className="flex items-center space-x-3"> {/* space-x-3으로 간격을 조금 더 넓혔습니다 */}
        
        {/* 👇 2. '경북대학교' 텍스트 대신 <img> 태그를 사용합니다. */}
        <img 
          src={knuLogo} 
          alt="경북대학교 로고" 
          className="h-10 w-auto" // 높이를 40px(h-10)로 설정하고 너비는 자동 비율 유지
        />

        {/* JOLUV 텍스트 */}
        <span className="text-xl font-bold text-pink-500 whitespace-nowrap">
          JOLUV
        </span>
      </Link>

      {/* 네비게이션 링크 영역 (기존과 동일) */}
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
        <Link to="/login" className="text-gray-700 font-semibold hover:text-blue-600 transition">
          Login
        </Link>
      </nav>
    </header>
  );
};

export default Header;