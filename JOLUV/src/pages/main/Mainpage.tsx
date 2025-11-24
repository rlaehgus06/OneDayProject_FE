import React from 'react';
import { useNavigate } from 'react-router-dom';
import TotalCredits from '../../components/displayCredits/totalCredits';
import EachCredits from '../../components/displayCredits/eachCredits';

// 👇 1. 이미지들을 import 합니다. (파일 경로와 확장자 .jpg/.png 확인 필수!)
import sugangLogo from '../../assets/sugang_logo.jpg';
import checkLogo from '../../assets/check_logo.jpg';
import hakjomLogo from '../../assets/hakjom_logo.jpg';
import mypageLogo from '../../assets/mypage_logo.jpg';

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KNU JOLUV</h1>
          <p className="text-lg text-gray-600">"컴퓨터학부 당신의 졸업을 위한 페이지 입니다."</p>
        </div>

        {/* Icon Button Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          
          {/* Card 1: 수강과목정리 */}
          <div
            onClick={() => handleCardClick('/score-management')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={sugangLogo} 
              alt="수강과목정리" 
              className="h-20 w-auto mx-auto mb-4 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">수강과목정리</h2>
          </div>

          {/* Card 2: Checklist Page */}
          <div
            onClick={() => handleCardClick('/checklist')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={checkLogo} 
              alt="졸업요건 checklist" 
              className="h-20 w-auto mx-auto mb-4 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">졸업요건 checklist</h2>
          </div>

          {/* Card 3: Summary Page */}
          <div
            onClick={() => handleCardClick('/summary')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={hakjomLogo} 
              alt="학점기록" 
              className="h-20 w-auto mx-auto mb-4 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">학점기록</h2>
          </div>

          {/* Card 4: Mypage (AI Plan -> 마이페이지로 변경됨) */}
          <div
            onClick={() => handleCardClick('/mypage')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <img 
              src={mypageLogo} 
              alt="마이페이지" 
              className="h-20 w-auto mx-auto mb-4 object-contain" 
            />
            <h2 className="text-xl font-semibold text-gray-700">마이페이지</h2>
          </div>
        </div>

        {/* 학점 현황 섹션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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