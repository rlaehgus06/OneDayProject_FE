import React from 'react';
import { useNavigate } from 'react-router-dom';
 import TotalCredits from '../../components/displayCredits/totalCredits';
 import EachCredits from '../../components/displayCredits/eachCredits';

// 아이콘을 위한 간단한 placeholder 컴포넌트
const IconPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-300 rounded-full w-12 h-12 mb-4 mx-auto ${className}`}></div>
);

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
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KNU 졸업요건</h1>
          <p className="text-lg text-gray-600">"컴퓨터학부 당신의 졸업을 위한 페이지 입니다."</p>
        </div>

        {/* Icon Button Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
         {/* Card 1: 수강과목정리 */}
        <div
          onClick={() => handleCardClick('/score-management')}
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer">
           <IconPlaceholder />
          <h2 className="text-xl font-semibold text-gray-700">수강과목정리</h2>
          </div>
          {/* Card 2: Checklist Page */}
          <div
            onClick={() => handleCardClick('/checklist')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <IconPlaceholder />
            <h2 className="text-xl font-semibold text-gray-700">졸업요건 checklist</h2>
          </div>
          {/* Card 3: Summary Page */}
          <div
            onClick={() => handleCardClick('/summary')}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <IconPlaceholder />
            <h2 className="text-xl font-semibold text-gray-700">학점기록</h2>
          </div>
          {/* Card 4: AI Plan */}
          <div
            onClick={() => console.log("AI Plan card clicked")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <IconPlaceholder />
            <h2 className="text-xl font-semibold text-gray-700">AI 추천 계획표</h2>
          </div>
        </div>
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