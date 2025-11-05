import React from 'react';
import { useNavigate } from 'react-router-dom';
import TotalCredits from '../../displayCredits/totalCredits';
import EachCredits from '../../displayCredits/eachCredits';

// 아이콘을 위한 간단한 placeholder 컴포넌트
const IconPlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`bg-gray-300 rounded-full w-12 h-12 mb-4 mx-auto ${className}`}></div>
);

const MainPage: React.FC = () => {
  const navigate = useNavigate();

  // 'handleLoginClick'은 Header.tsx로 이동했으므로 여기서는 삭제합니다.

  // 카드 클릭 시 페이지 이동
  const handleCardClick = (path: string) => {
    navigate(path);
  };

  return (
    // 1. 가장 바깥쪽 div를 삭제하고 React Fragment(<>)로 변경
    // Layout.tsx가 이미 배경색과 폰트를 적용하고 있습니다.
    <>
      {/* 2. <header> 섹션 전체 삭제 (Layout.tsx가 담당) */}

      {/* 3. <main> 태그에 'pt-20' 추가 */}
      {/* 고정된 헤더(Header)에 콘텐츠가 가려지지 않도록 상단 여백을 줍니다. */}
      <main className="p-8 pt-20">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">KNU 졸업요건</h1>
          <p className="text-lg text-gray-600">"컴퓨터학부 당신의 졸업을 위한 페이지 입니다."</p>
        </div>

        {/* Icon Button Grid Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-center mb-12">
          {/* Card 1: 수강과목정리 */}
          <div
            onClick={() => console.log("AI card clicked")}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
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
            <h2 className="text-xl font-semibold text-gray-700">학점 기록</h2>
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

        {/* 3. 학점 현황 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-6 text-center">나의 학점 현황</h3>
          
          <div className="flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-8 items-stretch">
            {/* 1. 왼쪽 컴포넌트: 전체 학점 현황 */}
            <div className="flex-1">
              <TotalCredits data={{totalCredits: 120, completedCredits:90}}/>
            </div>
            {/* 2. 오른쪽 컴포넌트: 전공/교양 학점 현황 */}
            <div className="flex-1">
              <EachCredits data={{MajorCredits:50, CultureCredits:30}}/>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default MainPage;