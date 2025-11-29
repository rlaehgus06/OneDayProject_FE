import React from 'react';
import { useNavigate } from 'react-router-dom';

import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';

// 이미지 import
import sugangLogo from '../../assets/sugang_logo.jpg';
import checkLogo from '../../assets/check_logo.jpg';
import hakjomLogo from '../../assets/hakjom_logo.jpg';
import mypageLogo from '../../assets/mypage_logo.jpg';
import titleLogo from '../../assets/knu_joluv_logo.jpg'; 

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    <>
      <div className="p-8">
        {/* Title Section */}
        <div className="text-center mb-12">
          <img 
            src={titleLogo} 
            alt="KNU JOLUV" 
            className="h-16 mx-auto mb-4 object-contain" 
          />
          <p className="text-xl text-gray-700 font-['Gowun_Batang'] font-bold">
            "성공적인 졸업을 위한 길라잡이입니다."
          </p>
          <p className="text-md text-gray-500 mt-2 font-['Gowun_Batang']">
            "Your Roadmap to a Successful Graduation."
          </p>
        </div>

        {/* Icon Button Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12 max-w-7xl mx-auto">
          
          {/* 1. 수강과목정리 카드 */}
          <div
            onClick={() => handleCardClick('/score-management')}
            className="
              bg-white p-4 
              rounded-full aspect-square 
              flex flex-col justify-center items-center 
              w-60 mx-auto 
              shadow-xl hover:shadow-2xl 
              border-4 border-gray-100 hover:border-pink-200 
              transition-all duration-300 cursor-pointer 
              hover:-translate-y-1
            "
          >
            <img 
              src={sugangLogo} 
              alt="수강과목정리" 
              className="h-24 w-auto mb-2 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">수강과목정리</h2>
          </div>

          {/* 2. 졸업요건 checklist 카드 */}
          <div
            onClick={() => handleCardClick('/checklist')}
            className="
              bg-white p-4 
              rounded-full aspect-square 
              flex flex-col justify-center items-center 
              w-60 mx-auto 
              shadow-xl hover:shadow-2xl 
              border-4 border-gray-100 hover:border-pink-200 
              transition-all duration-300 cursor-pointer 
              hover:-translate-y-1
            "
          >
            <img 
              src={checkLogo} 
              alt="졸업요건 checklist" 
              className="h-24 w-auto mb-2 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">졸업요건 check</h2>
          </div>

          {/* 3. 학점기록 카드 */}
          <div
            onClick={() => handleCardClick('/summary')}
            className="
              bg-white p-4 
              rounded-full aspect-square 
              flex flex-col justify-center items-center 
              w-60 mx-auto 
              shadow-xl hover:shadow-2xl 
              border-4 border-gray-100 hover:border-pink-200 
              transition-all duration-300 cursor-pointer 
              hover:-translate-y-1
            "
          >
            <img 
              src={hakjomLogo} 
              alt="학점기록" 
              className="h-24 w-auto mb-2 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">학점기록</h2>
          </div>

          {/* 4. 마이페이지 카드 */}
          <div
            onClick={() => handleCardClick('/mypage')}
            className="
              bg-white p-4 
              rounded-full aspect-square 
              flex flex-col justify-center items-center 
              w-60 mx-auto 
              shadow-xl hover:shadow-2xl 
              border-4 border-gray-100 hover:border-pink-200 
              transition-all duration-300 cursor-pointer 
              hover:-translate-y-1
            "
          >
            <img 
              src={mypageLogo} 
              alt="마이페이지" 
              className="h-24 w-auto mb-2 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">마이페이지</h2>
          </div>

        </div>

        <div className="max-w-7xl mx-auto mb-12">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 pl-2 border-l-4 border-pink-400">
            📊 나의 이수 현황
          </h3>
          
          <div className="flex flex-col lg:flex-row gap-6 items-stretch">
            {/* 1. 전체 이수율 표시 (왼쪽, 약 35% 너비) */}
            <div className="w-full lg:w-[35%]">
              <TotalCredits />
            </div>

            {/* 2. 전공/교양 상세 표시 (오른쪽, 약 65% 너비) */}
            <div className="w-full lg:w-[65%]">
              <EachCredits />
            </div>
          </div>
        </div>
        
      </div>
    </>
  );
};
export default MainPage;