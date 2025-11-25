import React from 'react';
import { useNavigate } from 'react-router-dom';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

// 이미지 import
import sugangLogo from '../../assets/sugang_logo.jpg';
import checkLogo from '../../assets/check_logo.jpg';
import hakjomLogo from '../../assets/hakjom_logo.jpg';
import mypageLogo from '../../assets/mypage_logo.jpg';
import titleLogo from '../../assets/knu_joluv_logo.png'; 

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
            <h2 className="text-xl font-semibold text-gray-700">졸업요건 checklist</h2>
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

        {/* 학점 현황 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8 max-w-7xl mx-auto">
          <div className="md:col-span-2 lg:col-span-2">
            <TotalCredits total={120} completed={90} percentage={75.0} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <EachCredits title="전공 학점" score={50} />
          </div>
          <div className="md:col-span-1 lg:col-span-1">
            <EachCredits title="교양 학점" score={30} />
          </div>
        </div>
        
      </div>
    </>
  );
};

export default MainPage;